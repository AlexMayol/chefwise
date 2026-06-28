// Derived market metrics from its offers + per-product info (no new DB queries).
// Structural inputs so callers pass MarketOfferListItem[] / ProductListItem-derived maps,
// and tests stay light.
type MarketOffer = { productId: string; normalizedPrice: number | null; observedAt: string | null; rating: number | null };
type ProductInfo = { bestNormalizedPrice: number | null };

export type MarketStats = {
  productsTracked: number;
  // Products for which this market matches the cheapest known normalized price.
  cheapestCount: number;
  recentlyUpdatedCount: number;
  avgRating: number | null;
  lastUpdated: string | null;
};

export function marketStats(
  offers: MarketOffer[],
  productInfo: Map<string, ProductInfo>,
  options: { now?: number; recentDays?: number } = {},
): MarketStats {
  const now = options.now ?? Date.now();
  const recentMs = (options.recentDays ?? 30) * 86_400_000;

  const products = new Set<string>();
  const cheapest = new Set<string>();
  const recent = new Set<string>();
  const ratings: number[] = [];
  let lastUpdated: string | null = null;

  for (const offer of offers) {
    products.add(offer.productId);
    const info = productInfo.get(offer.productId);

    if (offer.normalizedPrice != null && info?.bestNormalizedPrice != null && offer.normalizedPrice <= info.bestNormalizedPrice + 1e-6) {
      cheapest.add(offer.productId);
    }
    // Rating now lives on the offer, so the market's average is over its offers' ratings.
    if (offer.rating != null) ratings.push(offer.rating);
    if (offer.observedAt) {
      if (!lastUpdated || offer.observedAt > lastUpdated) lastUpdated = offer.observedAt;
      if (now - new Date(offer.observedAt).getTime() <= recentMs) recent.add(offer.productId);
    }
  }

  const avgRating = ratings.length ? ratings.reduce((total, value) => total + value, 0) / ratings.length : null;

  return {
    productsTracked: products.size,
    cheapestCount: cheapest.size,
    recentlyUpdatedCount: recent.size,
    avgRating,
    lastUpdated,
  };
}
