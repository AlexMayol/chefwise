import { fireEvent, render, waitFor } from '@testing-library/react-native';

import OfferDetailScreen from '@/app/offers/[offerId]';
import { useOffer } from '@/lib/hooks/use-product-offers';
import { useMarkets } from '@/lib/hooks/use-markets';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ offerId: 'offer-1' }),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

jest.mock('@/lib/hooks/use-markets', () => ({
  useMarkets: jest.fn(),
}));

jest.mock('@/lib/hooks/use-product-offers', () => ({
  useOffer: jest.fn(),
}));

const useMarketsMock = useMarkets as jest.MockedFunction<typeof useMarkets>;
const useOfferMock = useOffer as jest.MockedFunction<typeof useOffer>;

describe('offer detail screen', () => {
  const update = jest.fn(async () => undefined);
  const remove = jest.fn(async () => undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    useMarketsMock.mockReturnValue({
      items: [{ id: 'market-1', name: 'Wholesale Warehouse', address: null, imagePath: null, createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
    });
    useOfferMock.mockReturnValue({
      item: {
        id: 'offer-1',
        productId: 'product-1',
        marketId: 'market-1',
        brand: 'Coipesol',
        quantity: 500,
        unit: 'ml',
        rating: null,
        imagePath: null,
        description: null,
        price: 6,
        normalizedPrice: 12,
        normalizedUnit: 'l',
        observedAt: '2026-06-29T00:00:00.000Z',
        createdAt: '',
        updatedAt: '',
      },
      loading: false,
      reload: jest.fn(),
      update,
      remove,
    });
  });

  it('shows the offer single price and an edit-offer action', async () => {
    const screen = await render(<OfferDetailScreen />);

    expect(screen.getByText(/€6\.00/)).toBeTruthy();
    expect(screen.getByText('Edit offer')).toBeTruthy();
  });

  it('opens the offer form with the price field when editing', async () => {
    const screen = await render(<OfferDetailScreen />);

    fireEvent.press(screen.getByText('Edit offer'));

    await waitFor(() => {
      // Form opened: its market field and price field (exact, vs the screen's "Price: €6.00" line) appear.
      expect(screen.getByText('Market')).toBeTruthy();
      expect(screen.getByText('Price')).toBeTruthy();
    });
  });
});
