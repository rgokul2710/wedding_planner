import { z } from 'zod'

/** Treats an empty string (from a cleared text input) as absent rather than "". */
export const optionalText = z.preprocess((val) => (val === '' ? undefined : val), z.string().optional())

export const optionalPositiveInt = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number().int().positive('Must be a positive number').optional(),
)

export const optionalNonNegativeNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number().nonnegative('Must be zero or more').optional(),
)
