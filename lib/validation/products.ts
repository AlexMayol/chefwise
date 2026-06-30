import { z } from 'zod';

import { isoDateSchema, nameSchema, positiveNumberSchema, unitSchema, validationKeys } from './common';

export const categorySchema = z.object({
  name: nameSchema,
  description: z.string().optional().nullable(),
});

// A product is generic: rating, photo and description now live per-offer.
export const productSchema = z.object({
  name: nameSchema,
  categoryId: z.string().nullable().optional(),
  defaultUnit: unitSchema,
  isFavorite: z.boolean().default(false),
});

// Reused by both the product rating field (gone) and the offer rating field: blank → null, else 1–5.
const ratingSchema = z
  .preprocess(
    (value) => (value === '' || value === undefined ? null : value),
    z.coerce.number().int().min(1, validationKeys.ratingRange).max(5, validationKeys.ratingRange).nullable(),
  )
  .optional();

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

// A specific offer (market + optional brand + size), plus the rating/photo/description
// that describe it at that market.
export const offerSchema = z.object({
  marketId: nameSchema,
  brand: z.string().trim().optional().nullable(),
  quantity: positiveNumberSchema,
  unit: unitSchema,
  rating: ratingSchema,
  imagePath: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

// Create-only superset: the offer fields plus its first observed price.
export const offerCreateSchema = offerSchema.extend({
  price: positiveNumberSchema,
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
export type OfferCreateValues = z.infer<typeof offerCreateSchema>;
export type ProductPriceFormValues = z.infer<typeof productPriceSchema>;
