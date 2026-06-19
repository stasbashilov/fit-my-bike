import { describe, it, expect } from 'vitest'
import { calculateFit } from '../server/utils/fit-calculations'
import type { FitRequest } from '../shared/schemas/fitRequest'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function req(overrides: Partial<FitRequest> = {}): FitRequest {
  return {
    height: 1780,
    inseam: 820,
    discipline: 'road',
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Saddle height — base formula
// ---------------------------------------------------------------------------

describe('calculateFit — saddle height', () => {
  it('road: applies LeMond formula with 0 adjustment', () => {
    // inseam 820 * 0.883 = 723.86 → rounds to 724
    const result = calculateFit(req({ inseam: 820, discipline: 'road' }))
    expect(result.saddleHeight).toBe(724)
  })

  it('tt_triathlon: adds +8 mm to base', () => {
    // 820 * 0.883 = 723.86 → 724 + 8 = 732
    const result = calculateFit(req({ inseam: 820, discipline: 'tt_triathlon' }))
    expect(result.saddleHeight).toBe(732)
  })

  it('mtb_xc: subtracts 5 mm from base', () => {
    // 724 - 5 = 719
    const result = calculateFit(req({ inseam: 820, discipline: 'mtb_xc' }))
    expect(result.saddleHeight).toBe(719)
  })

  it('gravel: subtracts 2 mm from base', () => {
    // 724 - 2 = 722
    const result = calculateFit(req({ inseam: 820, discipline: 'gravel' }))
    expect(result.saddleHeight).toBe(722)
  })

  it('cyclocross: subtracts 6 mm from base', () => {
    // 724 - 6 = 718
    const result = calculateFit(req({ inseam: 820, discipline: 'cyclocross' }))
    expect(result.saddleHeight).toBe(718)
  })

  it('touring: subtracts 5 mm from base', () => {
    // 724 - 5 = 719
    const result = calculateFit(req({ inseam: 820, discipline: 'touring' }))
    expect(result.saddleHeight).toBe(719)
  })

  it('kids: uses conservative formula inseam * 0.883 * 0.85', () => {
    // 820 * 0.883 * 0.85 = 820 * 0.75055 = 615.451 → 615
    const result = calculateFit(req({ inseam: 820, discipline: 'kids' }))
    expect(result.saddleHeight).toBe(615)
  })

  it('kids: includes a saddleHeightNote warning', () => {
    const result = calculateFit(req({ discipline: 'kids' }))
    expect(result.saddleHeightNote).toBeTruthy()
    expect(typeof result.saddleHeightNote).toBe('string')
  })

  it('road: does not include saddleHeightNote', () => {
    const result = calculateFit(req({ discipline: 'road' }))
    expect(result.saddleHeightNote).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Torso angles
// ---------------------------------------------------------------------------

describe('calculateFit — torso angles', () => {
  it.each([
    ['road', 40, 45],
    ['tt_triathlon', 10, 25],
    ['mtb_xc', 50, 60],
    ['gravel', 50, 58],
    ['cyclocross', 48, 52],
    ['touring', 60, 65],
    ['kids', 65, 70],
  ] as const)('%s: returns correct angle range', (discipline, expectedMin, expectedMax) => {
    const result = calculateFit(req({ discipline }))
    expect(result.torsoAngleMin).toBe(expectedMin)
    expect(result.torsoAngleMax).toBe(expectedMax)
  })

  it('always includes a torsoAngleNote', () => {
    for (const discipline of ['road', 'tt_triathlon', 'mtb_xc', 'gravel', 'cyclocross', 'touring', 'kids'] as const) {
      const result = calculateFit(req({ discipline }))
      expect(result.torsoAngleNote).toBeTruthy()
    }
  })
})

// ---------------------------------------------------------------------------
// Handlebar width
// ---------------------------------------------------------------------------

describe('calculateFit — handlebar width', () => {
  it('omits handlebarWidth when shoulderWidth is not provided', () => {
    const result = calculateFit(req({ shoulderWidth: undefined }))
    expect(result.handlebarWidth).toBeUndefined()
    expect(result.handlebarWidthNote).toBeUndefined()
  })

  it('road: handlebarWidth equals shoulderWidth', () => {
    const result = calculateFit(req({ discipline: 'road', shoulderWidth: 400 }))
    expect(result.handlebarWidth).toBe(400)
  })

  it('gravel: handlebarWidth equals shoulderWidth', () => {
    const result = calculateFit(req({ discipline: 'gravel', shoulderWidth: 390 }))
    expect(result.handlebarWidth).toBe(390)
  })

  it('tt_triathlon: handlebarWidth equals shoulderWidth', () => {
    const result = calculateFit(req({ discipline: 'tt_triathlon', shoulderWidth: 380 }))
    expect(result.handlebarWidth).toBe(380)
  })

  it('cyclocross: handlebarWidth equals shoulderWidth', () => {
    const result = calculateFit(req({ discipline: 'cyclocross', shoulderWidth: 410 }))
    expect(result.handlebarWidth).toBe(410)
  })

  it('touring: handlebarWidth equals shoulderWidth', () => {
    const result = calculateFit(req({ discipline: 'touring', shoulderWidth: 420 }))
    expect(result.handlebarWidth).toBe(420)
  })

  it('mtb_xc: handlebarWidth equals shoulderWidth + 75', () => {
    const result = calculateFit(req({ discipline: 'mtb_xc', shoulderWidth: 400 }))
    expect(result.handlebarWidth).toBe(475)
  })

  it('kids: handlebarWidth equals shoulderWidth', () => {
    const result = calculateFit(req({ discipline: 'kids', shoulderWidth: 350 }))
    expect(result.handlebarWidth).toBe(350)
  })

  it('handlebarWidthNote is always a non-empty string when shoulderWidth is provided', () => {
    const disciplines = ['road', 'tt_triathlon', 'mtb_xc', 'gravel', 'cyclocross', 'touring', 'kids'] as const
    for (const discipline of disciplines) {
      const result = calculateFit(req({ discipline, shoulderWidth: 400 }))
      expect(typeof result.handlebarWidthNote).toBe('string')
      expect(result.handlebarWidthNote!.length).toBeGreaterThan(0)
    }
  })
})

// ---------------------------------------------------------------------------
// Discipline label
// ---------------------------------------------------------------------------

describe('calculateFit — disciplineLabel', () => {
  it.each([
    ['road', 'Road'],
    ['tt_triathlon', 'Time Trial / Triathlon'],
    ['mtb_xc', 'Mountain Bike (XC)'],
    ['gravel', 'Gravel'],
    ['cyclocross', 'Cyclocross'],
    ['touring', 'Touring'],
    ['kids', 'Kids'],
  ] as const)('%s → "%s"', (discipline, expectedLabel) => {
    const result = calculateFit(req({ discipline }))
    expect(result.disciplineLabel).toBe(expectedLabel)
  })
})

// ---------------------------------------------------------------------------
// Limitations
// ---------------------------------------------------------------------------

describe('calculateFit — limitations', () => {
  it('always includes all three standard limitations', () => {
    const result = calculateFit(req())
    expect(result.limitations).toContain('Does not account for leg length asymmetry')
    expect(result.limitations).toContain(
      'Assumes average crank length; adjust if your cranks are significantly longer or shorter',
    )
    expect(result.limitations).toContain(
      'Riders with limited hip/hamstring flexibility should go 3–5 mm lower on saddle height',
    )
  })

  it('limitations array has exactly 3 entries for a standard input', () => {
    const result = calculateFit(req())
    expect(result.limitations).toHaveLength(3)
  })
})

// ---------------------------------------------------------------------------
// Boundary inputs — confirm no crashes and reasonable outputs
// ---------------------------------------------------------------------------

describe('calculateFit — boundary values', () => {
  it('minimum allowed inseam (500 mm) returns a positive saddle height', () => {
    const result = calculateFit(req({ inseam: 500, discipline: 'road' }))
    expect(result.saddleHeight).toBeGreaterThan(0)
  })

  it('maximum allowed inseam (1200 mm) returns a saddle height ≤ inseam', () => {
    const result = calculateFit(req({ inseam: 1200, discipline: 'road' }))
    // saddle should never exceed inseam (sanity check)
    expect(result.saddleHeight).toBeLessThanOrEqual(1200)
  })

  it('tt_triathlon with max inseam still returns a positive result', () => {
    const result = calculateFit(req({ inseam: 1200, discipline: 'tt_triathlon' }))
    expect(result.saddleHeight).toBeGreaterThan(0)
  })

  it('armLength provided does not crash (accepted but unused for now)', () => {
    const result = calculateFit(req({ armLength: 650 }))
    expect(result).toBeDefined()
  })
})
