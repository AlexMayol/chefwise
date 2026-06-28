import {
  bestMarketByProduct,
  categoryActivity,
  cheapestMarketsForCategory,
  latestOfferPrices,
  type CategoryPriceEvent,
} from '@/lib/domain/category-insights';

const NOW = new Date('2026-06-26T12:00:00.000Z').getTime();
const daysAgo = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

function event(partial: Partial<CategoryPriceEvent> & { offerId: string }): CategoryPriceEvent {
  return {
    productId: 'p1',
    productName: 'Tomato',
    marketId: 'm1',
    marketName: 'Lidl',
    normalizedPrice: 2,
    normalizedUnit: 'kg',
    observedAt: daysAgo(1),
    ...partial,
  };
}

describe('latestOfferPrices', () => {
  it('keeps the most recent observation per offer regardless of input order', () => {
    const latest = latestOfferPrices([
      event({ offerId: 'o1', normalizedPrice: 5, observedAt: daysAgo(10) }),
      event({ offerId: 'o1', normalizedPrice: 3, observedAt: daysAgo(1) }),
    ]);

    expect(latest.size).toBe(1);
    expect(latest.get('o1')?.normalizedPrice).toBe(3);
  });
});

describe('bestMarketByProduct', () => {
  it('picks the cheapest current offer market per product', () => {
    const best = bestMarketByProduct([
      event({ offerId: 'o1', productId: 'p1', marketName: 'Lidl', normalizedPrice: 2 }),
      event({ offerId: 'o2', productId: 'p1', marketName: 'Aldi', normalizedPrice: 1.5 }),
      event({ offerId: 'o3', productId: 'p2', marketName: 'Carrefour', normalizedPrice: 4 }),
    ]);

    expect(best.get('p1')).toEqual({ marketName: 'Aldi', normalizedPrice: 1.5 });
    expect(best.get('p2')).toEqual({ marketName: 'Carrefour', normalizedPrice: 4 });
  });

  it('ignores offers without a price', () => {
    const best = bestMarketByProduct([event({ offerId: 'o1', productId: 'p9', normalizedPrice: null })]);
    expect(best.has('p9')).toBe(false);
  });
});

describe('cheapestMarketsForCategory', () => {
  it('ranks markets by how many products they are cheapest for', () => {
    const ranked = cheapestMarketsForCategory([
      // p1 cheapest at Lidl
      event({ offerId: 'o1', productId: 'p1', marketId: 'm-lidl', marketName: 'Lidl', normalizedPrice: 1 }),
      event({ offerId: 'o2', productId: 'p1', marketId: 'm-aldi', marketName: 'Aldi', normalizedPrice: 2 }),
      // p2 cheapest at Lidl
      event({ offerId: 'o3', productId: 'p2', marketId: 'm-lidl', marketName: 'Lidl', normalizedPrice: 3 }),
      // p3 cheapest at Aldi
      event({ offerId: 'o4', productId: 'p3', marketId: 'm-aldi', marketName: 'Aldi', normalizedPrice: 1 }),
    ]);

    expect(ranked).toEqual([
      { marketId: 'm-lidl', marketName: 'Lidl', productCount: 2 },
      { marketId: 'm-aldi', marketName: 'Aldi', productCount: 1 },
    ]);
  });
});

describe('categoryActivity', () => {
  it('returns recent updates, month-window counts, active markets and first/last', () => {
    const events = [
      event({ offerId: 'o1', productId: 'p1', marketId: 'm-lidl', marketName: 'Lidl', observedAt: daysAgo(0) }),
      event({ offerId: 'o2', productId: 'p2', marketId: 'm-lidl', marketName: 'Lidl', observedAt: daysAgo(3) }),
      event({ offerId: 'o3', productId: 'p3', marketId: 'm-aldi', marketName: 'Aldi', observedAt: daysAgo(10) }),
      // Outside the 30-day window: counts toward first-recorded but not the month summary.
      event({ offerId: 'o4', productId: 'p1', marketId: 'm-aldi', marketName: 'Aldi', observedAt: daysAgo(90) }),
    ];

    const activity = categoryActivity(events, { now: NOW });

    expect(activity.recentUpdates.map((e) => e.offerId)).toEqual(['o1', 'o2', 'o3', 'o4']);
    expect(activity.monthCounts).toEqual({ pricesAdded: 3, productsUpdated: 3, marketsUpdated: 2 });
    expect(activity.mostActiveMarkets).toEqual([
      { marketId: 'm-lidl', marketName: 'Lidl', count: 2 },
      { marketId: 'm-aldi', marketName: 'Aldi', count: 1 },
    ]);
    expect(activity.firstRecorded).toBe(daysAgo(90));
    expect(activity.lastRecorded).toBe(daysAgo(0));
  });

  it('handles an empty category', () => {
    expect(categoryActivity([], { now: NOW })).toEqual({
      recentUpdates: [],
      monthCounts: { pricesAdded: 0, productsUpdated: 0, marketsUpdated: 0 },
      mostActiveMarkets: [],
      firstRecorded: null,
      lastRecorded: null,
    });
  });
});
