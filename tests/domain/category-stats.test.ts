import { categoryPriceStats, mostTrackedCategoryId, productCountsByCategory } from '@/lib/domain/category-stats';

const p = (categoryId: string | null, bestNormalizedPrice: number | null) => ({ categoryId, bestNormalizedPrice });

describe('category stats', () => {
  it('summarizes count, tracked, cheapest/average/most expensive', () => {
    const stats = categoryPriceStats([p('a', 1), p('a', 3), p('a', null)]);
    expect(stats).toEqual({ count: 3, trackedCount: 2, cheapest: 1, average: 2, mostExpensive: 3 });
  });

  it('returns nulls when no product has a price', () => {
    expect(categoryPriceStats([p('a', null)])).toEqual({
      count: 1,
      trackedCount: 0,
      cheapest: null,
      average: null,
      mostExpensive: null,
    });
  });

  it('counts products per category and finds the most tracked', () => {
    const products = [p('a', 1), p('a', 2), p('b', 1), p(null, 5)];
    expect(productCountsByCategory(products).get('a')).toBe(2);
    expect(mostTrackedCategoryId(products)).toBe('a');
    expect(mostTrackedCategoryId([p(null, 1)])).toBeNull();
  });
});
