import { z } from 'zod';

import type { Unit } from '@/lib/domain/units';

export const validationKeys = {
  required: 'validation.required',
  positiveNumber: 'validation.positiveNumber',
  ratingRange: 'validation.ratingRange',
  invalidUnit: 'validation.invalidUnit',
  invalidDate: 'validation.invalidDate',
  marketRequired: 'validation.marketRequired',
} as const;

export const unitSchema = z.enum(['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'unit'], {
  error: validationKeys.invalidUnit,
}) satisfies z.ZodType<Unit>;

// Accept both decimal conventions: "3.99" and the Spanish "3,99" (and "1.234,56").
// When a comma is present we treat dots as thousands separators and the comma as the decimal.
function normalizeDecimal(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  return trimmed.includes(',') ? trimmed.replace(/\./g, '').replace(',', '.') : trimmed;
}

export const positiveNumberSchema = z.preprocess(normalizeDecimal, z.coerce.number().positive(validationKeys.positiveNumber));

export const isoDateSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: validationKeys.invalidDate,
});

export const nameSchema = z.string().trim().min(1, validationKeys.required);
