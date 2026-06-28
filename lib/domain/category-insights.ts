// Derived category insights/activity from its price observations (one new DB query feeds
// these). Structural input so the repo row shape and tests stay decoupled; `now` is
// injectable. Mirrors lib/domain/market-stats.ts.

export type CategoryPriceEvent = {
  offerId: string;
  productId: string;
  productName: string | null;
  marketId: string;
  marketName: string | null;
  normalizedPrice: number | null;
  normalizedUnit: string | null;
  observedAt: string;
};

// Latest observation per offer (max observedAt wins, order-independent).
export function latestOfferPrices(events: CategoryPriceEvent[]): Map<string, CategoryPriceEvent> {
  const latest = new Map<string, CategoryPriceEvent>();
  for (const event of events) {
    const current = latest.get(event.offerId);
    if (!current || event.observedAt > current.observedAt) latest.set(event.offerId, event);
  }
  return latest;
}

// Cheapest current offer's market per product — feeds the Products list rows.
export function bestMarketByProduct(
  events: CategoryPriceEvent[],
): Map<string, { marketName: string | null; normalizedPrice: number }> {
  const best = new Map<string, { marketName: string | null; normalizedPrice: number }>();
  for (const event of latestOfferPrices(events).values()) {
    if (event.normalizedPrice == null) continue;
    const current = best.get(event.productId);
    if (!current || event.normalizedPrice < current.normalizedPrice) {
      best.set(event.productId, { marketName: event.marketName, normalizedPrice: event.normalizedPrice });
    }
  }
  return best;
}

export type CheapestMarket = { marketId: string; marketName: string | null; productCount: number };

// Markets ranked by how many of the category's products they hold the cheapest price for.
export function cheapestMarketsForCategory(events: CategoryPriceEvent[]): CheapestMarket[] {
  // Cheapest current offer per product.
  const cheapestPerProduct = new Map<string, CategoryPriceEvent>();
  for (const event of latestOfferPrices(events).values()) {
    if (event.normalizedPrice == null) continue;
    const current = cheapestPerProduct.get(event.productId);
    if (!current || event.normalizedPrice < current.normalizedPrice!) cheapestPerProduct.set(event.productId, event);
  }

  const byMarket = new Map<string, CheapestMarket>();
  for (const event of cheapestPerProduct.values()) {
    const current = byMarket.get(event.marketId) ?? { marketId: event.marketId, marketName: event.marketName, productCount: 0 };
    current.productCount += 1;
    byMarket.set(event.marketId, current);
  }

  return [...byMarket.values()].sort(
    (a, b) => b.productCount - a.productCount || (a.marketName ?? '').localeCompare(b.marketName ?? ''),
  );
}

export type CategoryActivity = {
  recentUpdates: CategoryPriceEvent[];
  monthCounts: { pricesAdded: number; productsUpdated: number; marketsUpdated: number };
  mostActiveMarkets: { marketId: string; marketName: string | null; count: number }[];
  firstRecorded: string | null;
  lastRecorded: string | null;
};

export function categoryActivity(
  events: CategoryPriceEvent[],
  options: { now?: number; recentLimit?: number; monthDays?: number } = {},
): CategoryActivity {
  const now = options.now ?? Date.now();
  const recentLimit = options.recentLimit ?? 5;
  const monthMs = (options.monthDays ?? 30) * 86_400_000;

  const sorted = [...events].sort((a, b) => (a.observedAt < b.observedAt ? 1 : a.observedAt > b.observedAt ? -1 : 0));
  const recentEvents = events.filter((event) => now - new Date(event.observedAt).getTime() <= monthMs);

  const marketCounts = new Map<string, { marketId: string; marketName: string | null; count: number }>();
  for (const event of recentEvents) {
    const current = marketCounts.get(event.marketId) ?? { marketId: event.marketId, marketName: event.marketName, count: 0 };
    current.count += 1;
    marketCounts.set(event.marketId, current);
  }

  return {
    recentUpdates: sorted.slice(0, recentLimit),
    monthCounts: {
      pricesAdded: recentEvents.length,
      productsUpdated: new Set(recentEvents.map((event) => event.productId)).size,
      marketsUpdated: new Set(recentEvents.map((event) => event.marketId)).size,
    },
    mostActiveMarkets: [...marketCounts.values()]
      .sort((a, b) => b.count - a.count || (a.marketName ?? '').localeCompare(b.marketName ?? ''))
      .slice(0, recentLimit),
    firstRecorded: sorted.length ? sorted[sorted.length - 1].observedAt : null,
    lastRecorded: sorted.length ? sorted[0].observedAt : null,
  };
}
