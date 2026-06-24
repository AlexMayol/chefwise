import { useCallback, useEffect, useState } from 'react';

import { useAppDatabase } from '@/lib/db/provider';
import type { Market, MarketInput } from '@/lib/db/repositories/markets';

export function useMarkets() {
  const { repositories } = useAppDatabase();
  const [items, setItems] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await repositories.markets.list());
    } finally {
      setLoading(false);
    }
  }, [repositories.markets]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: MarketInput) => {
      const market = await repositories.markets.create(input);
      await reload();
      return market;
    },
    [reload, repositories.markets],
  );

  const update = useCallback(
    async (id: string, input: Partial<MarketInput>) => {
      await repositories.markets.update(id, input);
      await reload();
    },
    [reload, repositories.markets],
  );

  const remove = useCallback(
    async (id: string) => {
      await repositories.markets.delete(id);
      await reload();
    },
    [reload, repositories.markets],
  );

  return { items, loading, reload, create, update, remove };
}
