import { z } from 'zod'

export const SURFACES = ['road', 'gravel', 'mtb'] as const
export const TIRE_TYPES = ['clincher', 'tubeless', 'tubular'] as const

export type Surface = (typeof SURFACES)[number]
export type TireType = (typeof TIRE_TYPES)[number]

export const tirePressureRequestSchema = z.object({
  riderWeight: z
    .number({ required_error: 'Rider weight is required', invalid_type_error: 'Rider weight must be a number' })
    .min(20, 'Rider weight must be at least 20 kg')
    .max(200, 'Rider weight must be at most 200 kg'),

  bikeWeight: z
    .number({ invalid_type_error: 'Bike weight must be a number' })
    .min(3, 'Bike weight must be at least 3 kg')
    .max(30, 'Bike weight must be at most 30 kg')
    .optional(),

  tireWidthMm: z
    .number({ required_error: 'Tire width is required', invalid_type_error: 'Tire width must be a number' })
    .int('Tire width must be a whole number in mm')
    .min(18, 'Tire width must be at least 18 mm')
    .max(80, 'Tire width must be at most 80 mm'),

  tireType: z.enum(TIRE_TYPES, {
    required_error: 'Tire type is required',
    message: `Tire type must be one of: ${TIRE_TYPES.join(', ')}`,
  }),

  surface: z.enum(SURFACES, {
    required_error: 'Surface is required',
    message: `Surface must be one of: ${SURFACES.join(', ')}`,
  }),
})

export type TirePressureRequest = z.infer<typeof tirePressureRequestSchema>
