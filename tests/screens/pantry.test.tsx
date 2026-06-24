import { render } from '@testing-library/react-native';

import PantryScreen from '@/app/(tabs)/pantry';
import type { PantryTransaction } from '@/lib/db/repositories/pantry';
import { usePantry } from '@/lib/hooks/use-pantry';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useFocusEffect: (effect: () => void | (() => void)) => {
    effect();
  },
}));

jest.mock('@/lib/hooks/use-pantry', () => ({
  usePantry: jest.fn(),
}));

const usePantryMock = usePantry as jest.MockedFunction<typeof usePantry>;

const transaction: PantryTransaction = {
  id: 'transaction-1',
  productId: 'flour',
  pantryItemId: 'pantry-item-1',
  type: 'add',
  quantity: 2,
  unit: 'kg',
  occurredAt: '2026-01-02T00:00:00.000Z',
  note: null,
  shoppingListItemId: null,
  recipeId: null,
};

describe('pantry screen', () => {
  beforeEach(() => {
    usePantryMock.mockReturnValue({
      items: [],
      transactions: [transaction],
      loading: false,
      reload: jest.fn(),
      adjust: jest.fn(),
    } as ReturnType<typeof usePantry> & { transactions: PantryTransaction[] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows pantry transaction history from the pantry hook', async () => {
    const screen = await render(<PantryScreen />);

    expect(screen.getAllByText('Add stock').length).toBeGreaterThan(0);
    expect(screen.getByText('2 kg')).toBeTruthy();
  });
});
