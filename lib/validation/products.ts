import { z } from 'zod';

import { isoDateSchema, nameSchema, positiveNumberSchema, unitSchema, validationKeys } from './common';

export const categorySchema = z.object({
  name: nameSchema,
  description: z.string().optional().nullable(),
});

export const productSchema = z.object({
  name: nameSchema,
  categoryId: z.string().nullable().optional(),
  marketId: nameSchema,
  defaultUnit: unitSchema,
  rating: z
    .preprocess((value) => (value === '' || value === undefined ? null : value), z.coerce.number().int().min(1, validationKeys.ratingRange).max(5, validationKeys.ratingRange).nullable())
    .optional(),
  notes: z.string().optional().nullable(),
  isFavorite: z.boolean().default(false),
  imagePath: z.string().optional().nullable(),
  // Optional initial price captured at creation time; recorded as the first price observation.
  price: positiveNumberSchema.optional(),
  quantity: positiveNumberSchema.optional(),
});

export const productPriceSchema = z.object({
  price: positiveNumberSchema,
  quantity: positiveNumberSchema,
  unit: unitSchema,
  observedAt: isoDateSchema,
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductPriceFormValues = z.infer<typeof productPriceSchema>;
