import type { FitRequest, Discipline } from '../../shared/schemas/fitRequest'

// ---------------------------------------------------------------------------
// Output shape
// ---------------------------------------------------------------------------

export interface FitResult {
  saddleHeight: number
  saddleHeightNote?: string
  torsoAngleMin: number
  torsoAngleMax: number
  torsoAngleNote?: string
  handlebarWidth?: number
  handlebarWidthNote?: string
  disciplineLabel: string
  limitations: string[]
}

// ---------------------------------------------------------------------------
// Coefficients — sourced exclusively from .claude/docs/FIT-METHODOLOGY.md
// ---------------------------------------------------------------------------

/** LeMond/Hinault formula: BB center → saddle top */
const LEMOND_COEFFICIENT = 0.883

/**
 * Discipline adjustments to base saddle height (mm).
 * Ranges from the methodology doc — midpoint values used where a range is given.
 *   tt_triathlon: +5..+10 → midpoint +8 (rounded, as spec requests)
 *   gravel:       0..-3  → midpoint -2 (rounded)  [spec says -2]
 *   cyclocross:  -5..-8  → midpoint -6 (rounded)  [spec says -6]
 */
const SADDLE_ADJUSTMENT_MM: Record<Exclude<Discipline, 'kids'>, number> = {
  road: 0,
  tt_triathlon: 8,
  mtb_xc: -5,
  gravel: -2,
  cyclocross: -6,
  touring: -5,
}

/**
 * Kids saddle height uses a conservative formula instead of LeMond.
 * Methodology: "generous safety margin" → inseam * 0.883 * 0.85
 */
const KIDS_SADDLE_COEFFICIENT = LEMOND_COEFFICIENT * 0.85

/** Torso angles per discipline (degrees from horizontal). Source: methodology §3 */
const TORSO_ANGLES: Record<Discipline, { min: number; max: number; note: string }> = {
  road: {
    min: 40,
    max: 45,
    note: 'Aggressive race position — low stack, long reach.',
  },
  tt_triathlon: {
    min: 10,
    max: 25,
    note: 'Maximum aero — the lowest and most stretched position.',
  },
  mtb_xc: {
    min: 50,
    max: 60,
    note: 'Sporty but more upright than road for technical terrain handling.',
  },
  gravel: {
    min: 50,
    max: 58,
    note: 'Endurance-oriented — higher stack than road race, good all-day comfort.',
  },
  cyclocross: {
    min: 48,
    max: 52,
    note: 'Between road race and endurance — control on rough terrain and quick dismounts.',
  },
  touring: {
    min: 60,
    max: 65,
    note: 'Maximum upright for comfort on long distances.',
  },
  kids: {
    min: 65,
    max: 70,
    note: 'Safety and road visibility are the priority — upright position required.',
  },
}

/**
 * MTB flat-bar addition (midpoint of 50–100 mm range from methodology §4).
 */
const MTB_HANDLEBAR_ADDITION_MM = 75

/** Static limitation notices always shown to the user (methodology §6). */
const STANDARD_LIMITATIONS: string[] = [
  'Does not account for leg length asymmetry',
  'Assumes average crank length; adjust if your cranks are significantly longer or shorter',
  'Riders with limited hip/hamstring flexibility should go 3–5 mm lower on saddle height',
]

const DISCIPLINE_LABELS: Record<Discipline, string> = {
  road: 'Road',
  tt_triathlon: 'Time Trial / Triathlon',
  mtb_xc: 'Mountain Bike (XC)',
  gravel: 'Gravel',
  cyclocross: 'Cyclocross',
  touring: 'Touring',
  kids: 'Kids',
}

// ---------------------------------------------------------------------------
// Saddle height
// ---------------------------------------------------------------------------

function computeSaddleHeight(input: FitRequest): { height: number; note?: string } {
  if (input.discipline === 'kids') {
    return {
      height: Math.round(input.inseam * KIDS_SADDLE_COEFFICIENT),
      note: 'For children, the recommendation is approximate. A parent must physically verify safety on the actual bike — the child should be able to touch the ground with their tiptoe while seated.',
    }
  }

  const base = input.inseam * LEMOND_COEFFICIENT
  const adjustment = SADDLE_ADJUSTMENT_MM[input.discipline]
  return { height: Math.round(base + adjustment) }
}

// ---------------------------------------------------------------------------
// Handlebar width
// ---------------------------------------------------------------------------

function computeHandlebarWidth(
  discipline: Discipline,
  shoulderWidth: number,
): { width: number; note: string } {
  if (discipline === 'mtb_xc') {
    return {
      width: shoulderWidth + MTB_HANDLEBAR_ADDITION_MM,
      note: 'Flat bar: shoulder width + 5–10 cm for maneuverability on technical terrain.',
    }
  }

  if (discipline === 'kids') {
    return {
      width: shoulderWidth,
      note: 'Match shoulder width; verify fit on the actual bike.',
    }
  }

  // road, gravel, cyclocross, touring, tt_triathlon — drop bars
  return {
    width: shoulderWidth,
    note: 'Adjust ±10–20 mm by personal preference.',
  }
}

// ---------------------------------------------------------------------------
// Main exported function — no side effects, pure
// ---------------------------------------------------------------------------

export function calculateFit(input: FitRequest): FitResult {
  const { height: saddleHeight, note: saddleHeightNote } = computeSaddleHeight(input)
  const { min: torsoAngleMin, max: torsoAngleMax, note: torsoAngleNote } =
    TORSO_ANGLES[input.discipline]

  const result: FitResult = {
    saddleHeight,
    saddleHeightNote,
    torsoAngleMin,
    torsoAngleMax,
    torsoAngleNote,
    disciplineLabel: DISCIPLINE_LABELS[input.discipline],
    limitations: [...STANDARD_LIMITATIONS],
  }

  if (input.shoulderWidth !== undefined) {
    const { width, note } = computeHandlebarWidth(input.discipline, input.shoulderWidth)
    result.handlebarWidth = width
    result.handlebarWidthNote = note
  }

  // armLength is accepted in the schema for future reach calculations (methodology §1)
  // but the current model does not compute a reach/stem recommendation from it.
  // Flagged as an open question — see report below.

  return result
}
