// Derived category metrics computed from the product list (no new DB queries).
// Structural input so callers can pass ProductListItem[] and tests stay light.
type PricedProduct = { categoryId: string | null; bestNormalizedPrice: number | null };

export type CategoryPriceStats = {
  count: number;
  // Products with a known (tracked) price.
  trackedCount: number;
  cheapest: number | null;
  average: number | null;
  mostExpensive: number | null;
};

export function categoryPriceStats(products: PricedProduct[]): CategoryPriceStats {
  const prices = products.map((product) => product.bestNormalizedPrice).filter((value): value is number => value != null);
  const count = products.length;

  if (prices.length === 0) {
    return { count, trackedCount: 0, cheapest: null, average: null, mostExpensive: null };
  }

  const sum = prices.reduce((total, value) => total + value, 0);
  return {
    count,
    trackedCount: prices.length,
    cheapest: Math.min(...prices),
    average: sum / prices.length,
    mostExpensive: Math.max(...prices),
  };
}

// Counts of products per category id.
export function productCountsByCategory(products: PricedProduct[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const product of products) {
    if (!product.categoryId) continue;
    counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1);
  }
  return counts;
}

// The category with the most products — the "Most tracked" badge target. Null when none have products.
export function mostTrackedCategoryId(products: PricedProduct[]): string | null {
  let best: string | null = null;
  let bestCount = 0;
  productCountsByCategory(products).forEach((count, id) => {
    if (count > bestCount) {
      best = id;
      bestCount = count;
    }
  });
  return best;
}
