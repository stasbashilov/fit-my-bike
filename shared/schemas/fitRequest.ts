import { z } from 'zod'

// Measurement bounds — named constants, not magic numbers
const HEIGHT_MIN_MM = 1200
const HEIGHT_MAX_MM = 2200
const INSEAM_MIN_MM = 500
const INSEAM_MAX_MM = 1200
const ARM_LENGTH_MIN_MM = 400
const ARM_LENGTH_MAX_MM = 900
const SHOULDER_WIDTH_MIN_MM = 300
const SHOULDER_WIDTH_MAX_MM = 600

export const DISCIPLINES = [
  'road',
  'tt_triathlon',
  'mtb_xc',
  'gravel',
  'cyclocross',
  'touring',
  'kids',
] as const

export type Discipline = (typeof DISCIPLINES)[number]

export const fitRequestSchema = z.object({
  height: z
    .number({ required_error: 'Height is required', invalid_type_error: 'Height must be a number' })
    .int('Height must be a whole number in mm')
    .min(HEIGHT_MIN_MM, `Height must be at least ${HEIGHT_MIN_MM} mm`)
    .max(HEIGHT_MAX_MM, `Height must be at most ${HEIGHT_MAX_MM} mm`),

  inseam: z
    .number({ required_error: 'Inseam is required', invalid_type_error: 'Inseam must be a number' })
    .int('Inseam must be a whole number in mm')
    .min(INSEAM_MIN_MM, `Inseam must be at least ${INSEAM_MIN_MM} mm`)
    .max(INSEAM_MAX_MM, `Inseam must be at most ${INSEAM_MAX_MM} mm`),

  armLength: z
    .number({ invalid_type_error: 'Arm length must be a number' })
    .int('Arm length must be a whole number in mm')
    .min(ARM_LENGTH_MIN_MM, `Arm length must be at least ${ARM_LENGTH_MIN_MM} mm`)
    .max(ARM_LENGTH_MAX_MM, `Arm length must be at most ${ARM_LENGTH_MAX_MM} mm`)
    .optional(),

  shoulderWidth: z
    .number({ invalid_type_error: 'Shoulder width must be a number' })
    .int('Shoulder width must be a whole number in mm')
    .min(SHOULDER_WIDTH_MIN_MM, `Shoulder width must be at least ${SHOULDER_WIDTH_MIN_MM} mm`)
    .max(SHOULDER_WIDTH_MAX_MM, `Shoulder width must be at most ${SHOULDER_WIDTH_MAX_MM} mm`)
    .optional(),

  discipline: z.enum(DISCIPLINES, {
    required_error: 'Discipline is required',
    message: `Discipline must be one of: ${DISCIPLINES.join(', ')}`,
  }),
})

export type FitRequest = z.infer<typeof fitRequestSchema>
