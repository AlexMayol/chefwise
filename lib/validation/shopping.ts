import { z } from 'zod';

import { nameSchema, positiveNumberSchema, unitSchema } from './common';

export const shoppingListItemSchema = z.object({
  productId: nameSchema,
  plannedQuantity: positiveNumberSchema,
  plannedUnit: unitSchema,
  status: z.enum(['pending', 'bought', 'skipped']).default('pending'),
  actualQuantity: positiveNumberSchema.optional(),
  actualUnit: unitSchema.optional(),
  actualPrice: positiveNumberSchema.optional(),
  marketId: z.string().optional(),
});

export const shoppingListSchema = z.object({
  name: nameSchema,
  status: z.enum(['draft', 'active', 'completed', 'archived']).default('draft'),
  items: z.array(shoppingListItemSchema).default([]),
});

export const shoppingPurchaseSchema = z.object({
  actualQuantity: positiveNumberSchema,
  actualUnit: unitSchema,
  actualPrice: positiveNumberSchema,
  marketId: nameSchema,
});

export type ShoppingListFormValues = z.infer<typeof shoppingListSchema>;
export type ShoppingPurchaseFormValues = z.infer<typeof shoppingPurchaseSchema>;
