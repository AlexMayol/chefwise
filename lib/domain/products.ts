export type OfferImageCandidate = {
  id: string;
  rating: number | null;
  imagePath: string | null;
  createdAt: string;
};

// Product thumbnails use the photo from the top-rated offer that has one. Unrated offers
// lose to any rated offer; ties break to the most recently created offer.
export function pickBestOfferImagePath(offers: OfferImageCandidate[]): string | null {
  const withImage = offers.filter((offer) => offer.imagePath);
  if (withImage.length === 0) {
    return null;
  }

  const [best] = [...withImage].sort((left, right) => {
    const ratingLeft = left.rating ?? -Infinity;
    const ratingRight = right.rating ?? -Infinity;
    if (ratingRight !== ratingLeft) {
      return ratingRight - ratingLeft;
    }

    const createdComparison = right.createdAt.localeCompare(left.createdAt);
    return createdComparison === 0 ? right.id.localeCompare(left.id) : createdComparison;
  });

  return best?.imagePath ?? null;
}
