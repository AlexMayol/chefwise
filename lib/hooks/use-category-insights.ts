import { useCallback } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { CategoryPriceEventItem } from '@/lib/db/repositories/product-offers';

import { useDetail } from './use-detail';

// Price observations for a category, newest first. The Insights/Activity tabs derive their
// aggregates from these via lib/domain/category-insights.ts.
export function useCategoryInsights(categoryId?: string) {
  const { repositories } = useAppDatabase();
  const load = useCallback(
    (id: string) => repositories.productOffers.listPriceEventsForCategory(id),
    [repositories.productOffers],
  );
  return useDetail<CategoryPriceEventItem[]>(categoryId, load, []);
}
