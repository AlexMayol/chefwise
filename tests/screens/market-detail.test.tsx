import { fireEvent, render } from '@testing-library/react-native';

import MarketDetailScreen from '@/app/markets/[marketId]';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useProducts } from '@/lib/hooks/use-products';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useLocalSearchParams: () => ({ marketId: 'market-1' }),
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('@/lib/hooks/use-markets', () => ({
  useMarkets: jest.fn(),
}));

jest.mock('@/lib/hooks/use-products', () => ({
  useProducts: jest.fn(),
}));

const useMarketsMock = useMarkets as jest.MockedFunction<typeof useMarkets>;
const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;

function product(id: string, name: string, marketId: string) {
  return {
    id,
    name,
    categoryId: null,
    marketId,
    defaultUnit: 'unit' as const,
    rating: null,
    notes: null,
    isFavorite: false,
    imagePath: null,
    createdAt: '',
    updatedAt: '',
    marketName: null,
    price: null,
    normalizedPrice: null,
    normalizedUnit: null,
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
    });
    useProductsMock.mockReturnValue({
      items: [product('product-1', 'Tomato', 'market-1'), product('product-2', 'Bread', 'market-2')],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      assign: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lists only the products sold at the market', async () => {
    const screen = await render(<MarketDetailScreen />);

    expect(screen.getByText('Tomato')).toBeTruthy();
    expect(screen.queryByText('Bread')).toBeNull();
  });

  it('opens the edit flow and saves changes', async () => {
    const screen = await render(<MarketDetailScreen />);

    await fireEvent.press(screen.getByLabelText('Edit'));
    await fireEvent.changeText(screen.getByDisplayValue('Lidl'), 'Aldi');
    await fireEvent.press(screen.getByText('Save'));

    expect(update).toHaveBeenCalledWith('market-1', { name: 'Aldi', address: 'Main St', imagePath: null });
  });
});
