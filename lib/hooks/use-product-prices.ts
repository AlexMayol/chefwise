import { useCallback } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { ProductPrice, ProductPriceInput } from '@/lib/db/repositories/product-prices';

import { useDetail } from './use-detail';

export function useProductPrices(productId?: string) {
  const { repositories } = useAppDatabase();
  const load = useCallback((id: string) => repositories.productPrices.listForProduct(id), [repositories.productPrices]);
  const { item: items, loading, reload } = useDetail<ProductPrice[]>(productId, load, []);

  const create = useCallback(
    async (input: ProductPriceInput) => {
      const price = await repositories.productPrices.create(input);
      await reload();
      return price;
    },
    [reload, repositories.productPrices],
  );

  const latest = items.length > 0 ? items[0] : null;

  return { items, latest, loading, reload, create };
}
