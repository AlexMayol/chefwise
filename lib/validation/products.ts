import { z } from 'zod';

import { isoDateSchema, nameSchema, positiveNumberSchema, unitSchema, validationKeys } from './common';

export const categorySchema = z.object({
  name: nameSchema,
});

export const productSchema = z.object({
  name: nameSchema,
  categoryId: z.string().nullable().optional(),
  defaultUnit: unitSchema,
  rating: z
    .preprocess((value) => (value === '' || value === undefined ? null : value), z.coerce.number().int().min(1, validationKeys.ratingRange).max(5, validationKeys.ratingRange).nullable())
    .optional(),
  notes: z.string().optional().nullable(),
  isFavorite: z.boolean().default(false),
  imagePath: z.string().optional().nullable(),
});

export const productPriceSchema = z.object({
  marketId: nameSchema,
  price: positiveNumberSchema,
  quantity: positiveNumberSchema,
  unit: unitSchema,
  observedAt: isoDateSchema,
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductPriceFormValues = z.infer<typeof productPriceSchema>;
