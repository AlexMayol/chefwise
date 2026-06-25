import { useAppDatabase } from '@/lib/db/provider';
import type { Market, MarketInput } from '@/lib/db/repositories/markets';

import { useCollection } from './use-collection';

export function useMarkets() {
  return useCollection<Market, MarketInput>(useAppDatabase().repositories.markets);
}
