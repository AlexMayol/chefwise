import { marketStats } from '@/lib/domain/market-stats';

const NOW = new Date('2026-06-26T12:00:00.000Z').getTime();
const daysAgo = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

describe('marketStats', () => {
  it('counts tracked, cheapest, recent products, average rating and last update', () => {
    const info = new Map([
      ['p1', { bestNormalizedPrice: 2 }], // this market is cheapest (2 <= 2)
      ['p2', { bestNormalizedPrice: 1 }], // cheaper elsewhere (3 > 1)
      ['p3', { bestNormalizedPrice: null }],
    ]);
    // Rating lives on the offer now, so the market's average is over its offers' ratings.
    const offers = [
      { productId: 'p1', normalizedPrice: 2, observedAt: daysAgo(2), rating: 4 },
      { productId: 'p2', normalizedPrice: 3, observedAt: daysAgo(60), rating: 2 },
      { productId: 'p3', normalizedPrice: null, observedAt: daysAgo(1), rating: null },
    ];

    const stats = marketStats(offers, info, { now: NOW });

    expect(stats.productsTracked).toBe(3);
    expect(stats.cheapestCount).toBe(1); // only p1
    expect(stats.recentlyUpdatedCount).toBe(2); // p1 (2d) + p3 (1d); p2 is 60d
    expect(stats.avgRating).toBe(3); // (4 + 2) / 2, p3 has no rating
    expect(stats.lastUpdated).toBe(daysAgo(1));
  });

  it('handles a market with no offers', () => {
    expect(marketStats([], new Map(), { now: NOW })).toEqual({
      productsTracked: 0,
      cheapestCount: 0,
      recentlyUpdatedCount: 0,
      avgRating: null,
      lastUpdated: null,
    });
  });
});
