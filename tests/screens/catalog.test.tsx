import { fireEvent, render } from '@testing-library/react-native';

import ProductDetailScreen from '@/app/products/[productId]';
import ProductsScreen from '@/app/(tabs)/products';
import { useCategories } from '@/lib/hooks/use-categories';
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

jest.mock('@/lib/images/storage', () => ({
  resolveEntityImageUri: (path: string | null | undefined) => (path ? `resolved://${path}` : null),
}));

const useCategoriesMock = useCategories as jest.MockedFunction<typeof useCategories>;
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

    await fireEvent.press(screen.getByText('Favorites first'));
    expect(useProductsMock).toHaveBeenLastCalledWith(expect.objectContaining({ sort: 'favorites_first' }));
  });

  it('shows category emojis in the category filter picker', async () => {
    useCategoriesMock.mockReturnValue({
      items: [
        { id: 'cat-1', name: 'Dairy & Eggs', description: '🧀', createdAt: '', updatedAt: '' },
        { id: 'cat-2', name: 'Vegetables', description: '🥬', createdAt: '', updatedAt: '' },
      ],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
    });

    const screen = await render(<ProductsScreen />);
    await fireEvent.press(screen.getByText('All Categories'));

    expect(screen.getByText('🥬')).toBeTruthy();
    expect(screen.getByText('🧀')).toBeTruthy();
  });

  it('shows the category stored emoji in section headers, not the keyword fallback', async () => {
    useCategoriesMock.mockReturnValue({
      items: [{ id: 'cat-1', name: 'Dairy & Eggs', description: '🧀', createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
    });
    useProductsMock.mockReturnValue({
      items: [
        {
          id: 'product-1',
          name: 'Huevos L',
          categoryId: 'cat-1',
          defaultUnit: 'unit',
          isFavorite: false,
          offerCount: 1,
          marketCount: 1,
          bestPrice: 0.2,
          bestNormalizedPrice: 0.2,
          bestNormalizedUnit: 'unit',
          bestImagePath: null,
          createdAt: '',
          updatedAt: '',
        },
      ],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
      assign: jest.fn(),
    });

    const screen = await render(<ProductsScreen />);

    // "Dairy & Eggs" is not in the keyword map, so the buggy header rendered 🛒.
    expect(screen.queryByText('🛒')).toBeNull();
    // header emoji + product row emoji both come from the stored 🧀
    expect(screen.getAllByText('🧀').length).toBe(2);
  });

  it('shows the lowest purchase price on the product list, not the normalized unit price', async () => {
    useProductsMock.mockReturnValue({
      items: [
        {
          id: 'product-pasta',
          name: 'Pasta',
          categoryId: null,
          defaultUnit: 'kg',
          isFavorite: false,
          offerCount: 1,
          marketCount: 1,
          bestPrice: 5,
          bestNormalizedPrice: 10,
          bestNormalizedUnit: 'kg',
          bestImagePath: null,
          createdAt: '',
          updatedAt: '',
        },
      ],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
      assign: jest.fn(),
    });

    const screen = await render(<ProductsScreen />);

    expect(screen.getByText('From €5.00')).toBeTruthy();
    expect(screen.queryByText('From €10.00')).toBeNull();
  });

  it('shows product detail with its offers and prices', async () => {
    useProductDetailMock.mockReturnValue({
      item: {
        id: 'product-1',
        name: 'Bread flour',
        categoryId: null,
        defaultUnit: 'kg',
        isFavorite: true,
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
          rating: null,
          imagePath: null,
          description: null,
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
    expect(screen.getByText('Favorite')).toBeTruthy();
  });

  it('shows the lowest purchase price in the product header summary', async () => {
    useProductDetailMock.mockReturnValue({
      item: {
        id: 'product-pasta',
        name: 'Pasta',
        categoryId: null,
        defaultUnit: 'kg',
        isFavorite: false,
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
          productId: 'product-pasta',
          marketId: 'market-1',
          brand: null,
          quantity: 500,
          unit: 'g',
          rating: 3,
          imagePath: null,
          description: null,
          createdAt: '',
          updatedAt: '',
          marketName: 'Wholesale Warehouse',
          price: 5,
          normalizedPrice: 10,
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

    expect(screen.getByText('From €5.00 · 1 market')).toBeTruthy();
    expect(screen.queryByText('From €10.00 · 1 market')).toBeNull();
  });

  it('uses the highest-rated offer image for the product hero avatar', async () => {
    useProductDetailMock.mockReturnValue({
      item: {
        id: 'product-1',
        name: 'Baguette',
        categoryId: 'cat-bakery',
        defaultUnit: 'unit',
        isFavorite: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      loading: false,
      reload: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });
    useCategoriesMock.mockReturnValue({
      items: [{ id: 'cat-bakery', name: 'Bakery', description: '🥖', createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
    });
    useProductOffersMock.mockReturnValue({
      items: [
        {
          id: 'offer-1',
          productId: 'product-1',
          marketId: 'market-1',
          brand: null,
          quantity: 1,
          unit: 'unit',
          rating: null,
          imagePath: null,
          description: null,
          createdAt: '2026-01-02T00:00:00.000Z',
          updatedAt: '2026-01-02T00:00:00.000Z',
          marketName: 'City Supermarket',
          price: 1.25,
          normalizedPrice: 1.25,
          normalizedUnit: 'unit',
          observedAt: '2026-01-02T00:00:00.000Z',
        },
        {
          id: 'offer-2',
          productId: 'product-1',
          marketId: 'market-2',
          brand: 'Hacendado',
          quantity: 1,
          unit: 'unit',
          rating: 5,
          imagePath: 'images/offers/corner-bakery.jpg',
          description: 'Wena wea',
          createdAt: '2026-01-03T00:00:00.000Z',
          updatedAt: '2026-01-03T00:00:00.000Z',
          marketName: 'Corner Bakery',
          price: 2.3,
          normalizedPrice: 2.3,
          normalizedUnit: 'unit',
          observedAt: '2026-01-03T00:00:00.000Z',
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

    // Hero uses the Corner Bakery photo; only the unrated City Supermarket row falls back to emoji.
    expect(screen.getAllByText('🥖').length).toBe(1);
  });
});
