import { fireEvent, render } from '@testing-library/react-native';

import MarketDetailScreen from '@/app/markets/[marketId]';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useMarketOffers } from '@/lib/hooks/use-product-offers';
import { useProducts } from '@/lib/hooks/use-products';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useLocalSearchParams: () => ({ marketId: 'market-1' }),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useFocusEffect: (effect: () => void | (() => void)) => {
    effect();
  },
}));

jest.mock('@/lib/hooks/use-markets', () => ({
  useMarkets: jest.fn(),
}));

jest.mock('@/lib/hooks/use-products', () => ({
  useProducts: jest.fn(),
}));

jest.mock('@/lib/hooks/use-product-offers', () => ({
  useMarketOffers: jest.fn(),
}));

// ProductGrid (rendered inside the add-products sheet) reads categories for its emoji.
jest.mock('@/lib/hooks/use-categories', () => ({
  useCategories: jest.fn(() => ({ items: [], loading: false, reload: jest.fn(), create: jest.fn(), update: jest.fn(), remove: jest.fn(), removeMany: jest.fn() })),
}));

const useMarketsMock = useMarkets as jest.MockedFunction<typeof useMarkets>;
const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;
const useMarketOffersMock = useMarketOffers as jest.MockedFunction<typeof useMarketOffers>;

function offer(id: string, productName: string, marketId: string) {
  return {
    id,
    productId: `prod-${id}`,
    marketId,
    brand: null,
    quantity: 1,
    unit: 'unit' as const,
    rating: null,
    imagePath: null,
    description: null,
    createdAt: '',
    updatedAt: '',
    marketName: 'Lidl',
    productName,
    price: null,
    normalizedPrice: null,
    normalizedUnit: null,
    observedAt: null,
  };
}

describe('market detail screen', () => {
  const update = jest.fn(async () => undefined);

  beforeEach(() => {
    update.mockClear();
    useMarketsMock.mockReturnValue({
      items: [{ id: 'market-1', name: 'Lidl', address: 'Main St', imagePath: null, createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update,
      remove: jest.fn(),
      removeMany: jest.fn(),
    });
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
    useMarketOffersMock.mockReturnValue({
      items: [offer('1', 'Tomato', 'market-1')],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lists the offers sold at the market', async () => {
    const screen = await render(<MarketDetailScreen />);

    expect(screen.getByText('Tomato')).toBeTruthy();
  });

  it('de-selecting an already-added product in the picker removes its offer', async () => {
    const remove = jest.fn(async () => undefined);
    useProductsMock.mockReturnValue({
      // prod-1 matches the existing offer (offer('1') -> productId 'prod-1'); distinct name isolates the picker from the offer list.
      items: [
        { id: 'prod-1', name: 'AlreadyHere', categoryId: null, imagePath: null, rating: null, isFavorite: false, defaultUnit: 'unit', offerCount: 1, bestNormalizedPrice: null, bestNormalizedUnit: null, createdAt: '', updatedAt: '' },
        { id: 'prod-2', name: 'Onion', categoryId: null, imagePath: null, rating: null, isFavorite: false, defaultUnit: 'unit', offerCount: 0, bestNormalizedPrice: null, bestNormalizedUnit: null, createdAt: '', updatedAt: '' },
      ] as never,
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
      assign: jest.fn(),
    });
    useMarketOffersMock.mockReturnValue({
      items: [offer('1', 'Tomato', 'market-1')],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      remove,
    });

    const screen = await render(<MarketDetailScreen />);
    await fireEvent.press(screen.getByText('Add product'));

    // The already-added product is shown so it can be toggled off.
    await fireEvent.press(screen.getByText('AlreadyHere'));
    await fireEvent.press(screen.getByText('Save'));

    expect(remove).toHaveBeenCalledWith('1');
  });

  it('opens the edit flow and saves changes', async () => {
    const screen = await render(<MarketDetailScreen />);

    await fireEvent.press(screen.getByLabelText('Edit'));
    await fireEvent.changeText(screen.getByDisplayValue('Lidl'), 'Aldi');
    await fireEvent.press(screen.getByLabelText('Save'));

    expect(update).toHaveBeenCalledWith('market-1', { name: 'Aldi', address: 'Main St', imagePath: null });
  });
});
