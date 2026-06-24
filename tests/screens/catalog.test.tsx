import { fireEvent, render } from '@testing-library/react-native';

import ProductDetailScreen from '@/app/products/[productId]';
import ProductsScreen from '@/app/(tabs)/products';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useProductPrices } from '@/lib/hooks/use-product-prices';
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

jest.mock('@/lib/hooks/use-product-prices', () => ({
  useProductPrices: jest.fn(),
}));

jest.mock('@/lib/hooks/use-markets', () => ({
  useMarkets: jest.fn(),
}));

jest.mock('@/components/domain/product-form', () => ({
  ProductForm: ({ initialValues }: { initialValues?: { name?: string } }) => null,
}));

const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;
const useProductDetailMock = useProductDetail as jest.MockedFunction<typeof useProductDetail>;
const useProductPricesMock = useProductPrices as jest.MockedFunction<typeof useProductPrices>;
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
    });
    useProductDetailMock.mockReturnValue({
      item: null,
      loading: false,
      reload: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });
    useProductPricesMock.mockReturnValue({
      items: [],
      latest: null,
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
    });
    useMarketsMock.mockReturnValue({
      items: [],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lets users filter favorites and sort products', async () => {
    const screen = await render(<ProductsScreen />);

    await fireEvent.press(screen.getByText('Filters'));
    await fireEvent.press(screen.getByText('Favorites only'));
    expect(useProductsMock).toHaveBeenLastCalledWith(expect.objectContaining({ favoritesOnly: true }));

    await fireEvent.press(screen.getByText('Highest rated'));
    expect(useProductsMock).toHaveBeenLastCalledWith(expect.objectContaining({ sort: 'highest_rated' }));
  });

  it('shows product detail context and markets with prices', async () => {
    useProductDetailMock.mockReturnValue({
      item: {
        id: 'product-1',
        name: 'Bread flour',
        categoryId: null,
        marketId: 'market-1',
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
    useProductPricesMock.mockReturnValue({
      items: [
        {
          id: 'price-1',
          productId: 'product-1',
          price: 4,
          quantity: 1,
          unit: 'kg',
          normalizedPrice: 4,
          normalizedUnit: 'kg',
          observedAt: '2026-01-02T00:00:00.000Z',
          createdAt: '2026-01-02T00:00:00.000Z',
        },
      ],
      latest: {
        id: 'price-1',
        productId: 'product-1',
        price: 4,
        quantity: 1,
        unit: 'kg',
        normalizedPrice: 4,
        normalizedUnit: 'kg',
        observedAt: '2026-01-02T00:00:00.000Z',
        createdAt: '2026-01-02T00:00:00.000Z',
      },
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
    });
    useMarketsMock.mockReturnValue({
      items: [{ id: 'market-1', name: 'Central Market', address: 'Main St', imagePath: null, createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });

    const screen = await render(<ProductDetailScreen />);

    expect(screen.getByText('Bread flour')).toBeTruthy();
    expect(screen.getAllByText('Central Market').length).toBeGreaterThan(0);
  });
});
