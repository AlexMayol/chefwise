import { z } from 'zod';

import { nameSchema } from './common';

export const marketSchema = z.object({
  name: nameSchema,
  address: z.string().optional().nullable(),
  imagePath: z.string().optional().nullable(),
});

export type MarketFormValues = z.infer<typeof marketSchema>;
