import { readValidatedBody } from 'h3'
import { fitRequestSchema } from '../../shared/schemas/fitRequest'
import { calculateFit } from '../utils/fit-calculations'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (raw) => fitRequestSchema.safeParse(raw))

  if (!body.success) {
    const firstIssue = body.error.issues[0]
    throw createError({
      statusCode: 422,
      data: {
        error: firstIssue?.message ?? 'Invalid request body',
        field: firstIssue?.path.join('.') || undefined,
        issues: body.error.issues.map((issue) => ({
          field: issue.path.join('.') || undefined,
          message: issue.message,
        })),
      },
    })
  }

  return calculateFit(body.data)
})
