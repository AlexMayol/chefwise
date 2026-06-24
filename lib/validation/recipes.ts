import { z } from 'zod';

import { nameSchema, positiveNumberSchema, unitSchema } from './common';

export const recipeProductSchema = z.object({
  productId: nameSchema,
  quantity: positiveNumberSchema,
  unit: unitSchema,
  marketId: z.string().optional().nullable(),
});

export const recipeSchema = z.object({
  name: nameSchema,
  description: z.string().optional().nullable(),
  servings: positiveNumberSchema,
  pricingStrategy: z.enum(['manual', 'cheapest_available']),
  imagePath: z.string().optional().nullable(),
  ingredients: z.array(recipeProductSchema).default([]),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;
