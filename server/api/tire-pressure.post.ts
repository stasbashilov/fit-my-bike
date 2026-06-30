import { tirePressureRequestSchema } from '../../shared/schemas/tirePressureRequest'
import { calculateTirePressure } from '../utils/tire-pressure'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = tirePressureRequestSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      data: { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
    })
  }

  return calculateTirePressure(parsed.data)
})
