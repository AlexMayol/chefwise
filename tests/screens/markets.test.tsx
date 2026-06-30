import { fireEvent, render, waitFor } from '@testing-library/react-native';

import MarketsScreen from '@/app/(tabs)/markets';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useAllOffers } from '@/lib/hooks/use-product-offers';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useFocusEffect: (effect: () => void | (() => void)) => {
    effect();
  },
}));

jest.mock('@/lib/hooks/use-markets', () => ({
  useMarkets: jest.fn(),
}));

jest.mock('@/lib/hooks/use-product-offers', () => ({
  useAllOffers: jest.fn(),
}));

jest.mock('@/components/domain/market-form', () => ({
  MarketForm: () => null,
}));

jest.mock('@/lib/images/storage', () => ({
  resolveEntityImageUri: (path: string | null | undefined) => (path ? `resolved://${path}` : null),
}));

const useMarketsMock = useMarkets as jest.MockedFunction<typeof useMarkets>;
const useAllOffersMock = useAllOffers as jest.MockedFunction<typeof useAllOffers>;

function longPressMarketRow(screen: Awaited<ReturnType<typeof render>>, marketId: string) {
  fireEvent(screen.getByTestId(`market-row-${marketId}`), 'onLongPress');
}

describe('markets listing screen', () => {
  const remove = jest.fn(async () => undefined);

  beforeEach(() => {
    remove.mockClear();
    useMarketsMock.mockReturnValue({
      items: [{ id: 'market-1', name: 'Lidl', address: 'Main St', imagePath: null, createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove,
      removeMany: jest.fn(),
    });
    useAllOffersMock.mockReturnValue({
      items: [],
      loading: false,
      reload: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('opens quick actions on long press and deletes the market', async () => {
    const screen = await render(<MarketsScreen />);

    longPressMarketRow(screen, 'market-1');
    await waitFor(() => expect(screen.getByText('Edit market')).toBeTruthy());

    await fireEvent.press(screen.getByText('Delete'));
    expect(remove).toHaveBeenCalledWith('market-1');
  });

  it('opens the edit sheet from quick actions', async () => {
    const screen = await render(<MarketsScreen />);

    longPressMarketRow(screen, 'market-1');
    await waitFor(() => expect(screen.getAllByText('Edit market').length).toBeGreaterThan(0));

    await fireEvent.press(screen.getByText('Edit market'));

    await waitFor(() => expect(screen.getByText('Edit market')).toBeTruthy());
  });
});
