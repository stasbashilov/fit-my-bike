import type { TirePressureRequest, Surface, TireType } from '../../shared/schemas/tirePressureRequest'

// ---------------------------------------------------------------------------
// Output shape
// ---------------------------------------------------------------------------

export interface TirePressureResult {
  frontBar: number
  rearBar: number
  frontPsi: number
  rearPsi: number
  surfaceLabel: string
  tireTypeLabel: string
  note: string
  limitations: string[]
}

// ---------------------------------------------------------------------------
// Coefficients — sourced from .claude/docs/FIT-METHODOLOGY.md §6
//
// K used in: pressure_bar = (load_kg × K) / tire_width_mm
// Calibrated against: 83 kg system, 25 mm road clincher → ~97 psi rear / ~80 psi front
// ---------------------------------------------------------------------------

const DEFAULT_BIKE_WEIGHT_KG = 8
const FRONT_LOAD_RATIO = 0.45
const REAR_LOAD_RATIO = 0.55
const BAR_TO_PSI = 14.504

/**
 * Pressure coefficient K by [surface][tireType].
 * Tubular on gravel/mtb falls back to clincher value (rare combo — see methodology §6 limitations).
 */
const K: Record<Surface, Record<TireType, number>> = {
  road:   { clincher: 3.7, tubeless: 3.1, tubular: 3.9 },
  gravel: { clincher: 2.5, tubeless: 2.1, tubular: 2.5 },
  mtb:    { clincher: 2.2, tubeless: 1.9, tubular: 2.2 },
}

const SURFACE_LABELS: Record<Surface, string> = {
  road:   'Road',
  gravel: 'Gravel',
  mtb:    'MTB',
}

const TIRE_TYPE_LABELS: Record<TireType, string> = {
  clincher: 'Clincher',
  tubeless: 'Tubeless',
  tubular:  'Tubular',
}

const SURFACE_NOTES: Record<Surface, string> = {
  road:   'Road tires are sensitive to pressure — ±0.3 bar affects rolling resistance and comfort noticeably.',
  gravel: 'Lower pressure improves traction and comfort on loose surfaces. Adjust down further on rough gravel.',
  mtb:    'MTB pressure is highly terrain-dependent. Technical descents may benefit from going 0.3–0.5 bar lower.',
}

const STANDARD_LIMITATIONS: string[] = [
  'Does not account for altitude or temperature (each 10 °C changes pressure by ~0.1 bar)',
  'Rim internal width affects optimal pressure — wider rims allow slightly lower pressure',
  'Fine-tune by feel: too hard = skipping on rough surfaces; too soft = sluggish or pinch flats',
]

// ---------------------------------------------------------------------------
// Main exported function — pure, no side effects
// ---------------------------------------------------------------------------

export function calculateTirePressure(input: TirePressureRequest): TirePressureResult {
  const bikeWeight = input.bikeWeight ?? DEFAULT_BIKE_WEIGHT_KG
  const systemWeight = input.riderWeight + bikeWeight

  const frontLoad = systemWeight * FRONT_LOAD_RATIO
  const rearLoad = systemWeight * REAR_LOAD_RATIO

  const k = K[input.surface][input.tireType]

  const frontBar = (frontLoad * k) / input.tireWidthMm
  const rearBar = (rearLoad * k) / input.tireWidthMm

  return {
    frontBar: Math.round(frontBar * 10) / 10,
    rearBar:  Math.round(rearBar * 10) / 10,
    frontPsi: Math.round(frontBar * BAR_TO_PSI),
    rearPsi:  Math.round(rearBar * BAR_TO_PSI),
    surfaceLabel:   SURFACE_LABELS[input.surface],
    tireTypeLabel:  TIRE_TYPE_LABELS[input.tireType],
    note:           SURFACE_NOTES[input.surface],
    limitations:    [...STANDARD_LIMITATIONS],
  }
}
