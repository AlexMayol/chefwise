import { z } from 'zod';

import { isoDateSchema, nameSchema, positiveNumberSchema, unitSchema, validationKeys } from './common';

export const categorySchema = z.object({
  name: nameSchema,
  description: z.string().optional().nullable(),
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

// Create-only superset: the product fields plus an optional first price
// (market + price + per-unit). If a price is entered, a market is required.
export const productCreateSchema = productSchema
  .extend({
    marketId: z.string().optional().nullable(),
    price: z.preprocess(
      (value) => (value === '' || value === undefined || value === null ? undefined : value),
      positiveNumberSchema.optional(),
    ),
  })
  .superRefine((value, ctx) => {
    if (value.price != null && !value.marketId) {
      ctx.addIssue({ path: ['marketId'], code: 'custom', message: validationKeys.marketRequired });
    }
  });

// A specific offer (market + optional brand + size) plus its first observed price.
export const offerSchema = z.object({
  marketId: nameSchema,
  brand: z.string().trim().optional().nullable(),
  quantity: positiveNumberSchema,
  unit: unitSchema,
  price: positiveNumberSchema,
});

export const offerPriceSchema = z.object({
  price: positiveNumberSchema,
  observedAt: isoDateSchema,
});

// Legacy product-level price (shopping "bought" flow only).
export const productPriceSchema = z.object({
  price: positiveNumberSchema,
  quantity: positiveNumberSchema,
  unit: unitSchema,
  observedAt: isoDateSchema,
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductCreateValues = z.infer<typeof productCreateSchema>;
export type OfferFormValues = z.infer<typeof offerSchema>;
export type OfferPriceFormValues = z.infer<typeof offerPriceSchema>;
export type ProductPriceFormValues = z.infer<typeof productPriceSchema>;
