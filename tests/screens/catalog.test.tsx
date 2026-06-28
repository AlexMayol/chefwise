import { fireEvent, render } from '@testing-library/react-native';

import ProductDetailScreen from '@/app/products/[productId]';
import ProductsScreen from '@/app/(tabs)/products';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useProductOffers } from '@/lib/hooks/use-product-offers';
import { useProductDetail, useProducts } from '@/lib/hooks/use-products';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useLocalSearchParams: () => ({ productId: 'product-1' }),
  useFocusEffect: (effect: () => void | (() => void)) => {
    effect();
  },
}));

jest.mock('@/lib/hooks/use-products', () => ({
  useProducts: jest.fn(),
  useProductDetail: jest.fn(),
}));

jest.mock('@/lib/hooks/use-product-offers', () => ({
  useProductOffers: jest.fn(),
}));

jest.mock('@/lib/hooks/use-markets', () => ({
  useMarkets: jest.fn(),
}));

jest.mock('@/lib/hooks/use-categories', () => ({
  useCategories: jest.fn(() => ({
    items: [],
    loading: false,
    reload: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeMany: jest.fn(),
  })),
}));

jest.mock('@/components/domain/product-form', () => ({
  ProductForm: () => null,
}));

const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;
const useProductDetailMock = useProductDetail as jest.MockedFunction<typeof useProductDetail>;
const useProductOffersMock = useProductOffers as jest.MockedFunction<typeof useProductOffers>;
const useMarketsMock = useMarkets as jest.MockedFunction<typeof useMarkets>;

describe('catalog screens', () => {
  beforeEach(() => {
    useProductsMock.mockReturnValue({
      items: [],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
      assign: jest.fn(),
    });
    useProductDetailMock.mockReturnValue({
      item: null,
      loading: false,
      reload: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });
    useProductOffersMock.mockReturnValue({
      items: [],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      createWithPrice: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });
    useMarketsMock.mockReturnValue({
      items: [],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lets users filter favorites and sort products', async () => {
    const screen = await render(<ProductsScreen />);

    await fireEvent.press(screen.getByLabelText('Filters'));
    await fireEvent.press(screen.getByText('Favorites only'));
    expect(useProductsMock).toHaveBeenLastCalledWith(expect.objectContaining({ favoritesOnly: true }));

    await fireEvent.press(screen.getByText('Highest rated'));
    expect(useProductsMock).toHaveBeenLastCalledWith(expect.objectContaining({ sort: 'highest_rated' }));
  });

  it('shows product detail with its offers and prices', async () => {
    useProductDetailMock.mockReturnValue({
      item: {
        id: 'product-1',
        name: 'Bread flour',
        categoryId: null,
        defaultUnit: 'kg',
        rating: 5,
        notes: 'High protein',
        isFavorite: true,
        imagePath: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      loading: false,
      reload: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });
    useProductOffersMock.mockReturnValue({
      items: [
        {
          id: 'offer-1',
          productId: 'product-1',
          marketId: 'market-1',
          brand: null,
          quantity: 1,
          unit: 'kg',
          createdAt: '',
          updatedAt: '',
          marketName: 'Central Market',
          price: 4,
          normalizedPrice: 4,
          normalizedUnit: 'kg',
          observedAt: '2026-01-02T00:00:00.000Z',
        },
      ],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      createWithPrice: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });

    const screen = await render(<ProductDetailScreen />);

    expect(screen.getByText('Bread flour')).toBeTruthy();
    expect(screen.getAllByText('Central Market').length).toBeGreaterThan(0);
  });
});
