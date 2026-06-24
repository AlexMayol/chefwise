import { useCallback, useEffect, useState } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { ProductPrice, ProductPriceInput } from '@/lib/db/repositories/product-prices';

export function useProductPrices(productId?: string) {
  const { repositories } = useAppDatabase();
  const [items, setItems] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(Boolean(productId));

  const reload = useCallback(async () => {
    if (!productId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setItems(await repositories.productPrices.listForProduct(productId));
    } finally {
      setLoading(false);
    }
  }, [productId, repositories.productPrices]);

  useEffect(() => {
    void reload();
  }, [reload]);

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
