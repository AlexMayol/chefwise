import { pickBestOfferImagePath } from '@/lib/domain/products';

describe('pickBestOfferImagePath', () => {
  it('returns null when no offer has an image', () => {
    expect(
      pickBestOfferImagePath([
        { id: 'a', rating: 5, imagePath: null, createdAt: '2026-01-02' },
        { id: 'b', rating: null, imagePath: null, createdAt: '2026-01-03' },
      ]),
    ).toBeNull();
  });

  it('prefers the highest-rated offer that has an image', () => {
    expect(
      pickBestOfferImagePath([
        { id: 'low', rating: 3, imagePath: 'images/offers/low.jpg', createdAt: '2026-01-01' },
        { id: 'high', rating: 5, imagePath: 'images/offers/high.jpg', createdAt: '2026-01-01' },
      ]),
    ).toBe('images/offers/high.jpg');
  });

  it('breaks rating ties with the most recently created offer', () => {
    expect(
      pickBestOfferImagePath([
        { id: 'older', rating: 5, imagePath: 'images/offers/older.jpg', createdAt: '2026-01-01' },
        { id: 'newer', rating: 5, imagePath: 'images/offers/newer.jpg', createdAt: '2026-01-03' },
      ]),
    ).toBe('images/offers/newer.jpg');
  });

  it('ignores unrated offers when a rated offer has an image', () => {
    expect(
      pickBestOfferImagePath([
        { id: 'unrated', rating: null, imagePath: 'images/offers/unrated.jpg', createdAt: '2026-01-05' },
        { id: 'rated', rating: 4, imagePath: 'images/offers/rated.jpg', createdAt: '2026-01-01' },
      ]),
    ).toBe('images/offers/rated.jpg');
  });
});
