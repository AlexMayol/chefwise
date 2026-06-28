import { z } from 'zod';

import { nameSchema, positiveNumberSchema, unitSchema } from './common';

export const recipeProductSchema = z.object({
  productId: nameSchema,
  // Chosen offer to cost against; omit/null = cheapest current offer.
  offerId: z.string().optional().nullable(),
  quantity: positiveNumberSchema,
  unit: unitSchema,
});

export const recipeSchema = z.object({
  name: nameSchema,
  description: z.string().optional().nullable(),
  servings: positiveNumberSchema,
  recipeCategoryId: z.string().optional().nullable(),
  isFavorite: z.boolean().optional(),
  imagePath: z.string().optional().nullable(),
  ingredients: z.array(recipeProductSchema).default([]),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

export const recipeCategorySchema = z.object({
  name: nameSchema,
  emoji: z.string().optional().nullable(),
  description: z.string().max(60).optional().nullable(),
});

export type RecipeCategoryFormValues = z.infer<typeof recipeCategorySchema>;
