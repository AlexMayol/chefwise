import { z } from 'zod';

import { nameSchema, positiveNumberSchema, unitSchema } from './common';

export const pantryAdjustmentSchema = z.object({
  productId: nameSchema,
  type: z.enum(['add', 'remove', 'adjust', 'waste']),
  quantity: positiveNumberSchema,
  unit: unitSchema,
  note: z.string().optional().nullable(),
});

export type PantryAdjustmentFormValues = z.infer<typeof pantryAdjustmentSchema>;
