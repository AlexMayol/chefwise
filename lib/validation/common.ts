import { z } from 'zod';

import type { Unit } from '@/lib/domain/units';

export const validationKeys = {
  required: 'validation.required',
  positiveNumber: 'validation.positiveNumber',
  ratingRange: 'validation.ratingRange',
  invalidUnit: 'validation.invalidUnit',
  invalidDate: 'validation.invalidDate',
} as const;

export const unitSchema = z.enum(['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'unit'], {
  error: validationKeys.invalidUnit,
}) satisfies z.ZodType<Unit>;

export const positiveNumberSchema = z.coerce.number().positive(validationKeys.positiveNumber);

export const isoDateSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: validationKeys.invalidDate,
});

export const nameSchema = z.string().trim().min(1, validationKeys.required);
