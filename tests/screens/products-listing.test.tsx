import { fireEvent, render, waitFor } from '@testing-library/react-native';

import ProductsScreen from '@/app/(tabs)/products';
import { useCategories } from '@/lib/hooks/use-categories';
import { useProducts } from '@/lib/hooks/use-products';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useFocusEffect: (effect: () => void | (() => void)) => {
    effect();
  },
}));

jest.mock('@/lib/hooks/use-products', () => ({
  useProducts: jest.fn(),
}));

jest.mock('@/lib/hooks/use-categories', () => ({
  useCategories: jest.fn(),
}));

jest.mock('@/components/domain/product-form', () => ({
  ProductForm: () => null,
}));

jest.mock('@/lib/images/storage', () => ({
  resolveEntityImageUri: (path: string | null | undefined) => (path ? `resolved://${path}` : null),
}));

const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;
const useCategoriesMock = useCategories as jest.MockedFunction<typeof useCategories>;

function longPressProductRow(screen: Awaited<ReturnType<typeof render>>, productId: string) {
  fireEvent(screen.getByTestId(`product-row-${productId}`), 'onLongPress');
}

describe('products listing screen', () => {
  beforeEach(() => {
    useCategoriesMock.mockReturnValue({
      items: [{ id: 'category-1', name: 'Bakery', description: '🥖', createdAt: '', updatedAt: '' }],
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
          name: 'Baguette',
          categoryId: 'category-1',
          defaultUnit: 'unit',
          isFavorite: false,
          createdAt: '',
          updatedAt: '',
          offerCount: 1,
          marketCount: 1,
          bestPrice: 2.5,
          bestNormalizedPrice: null,
          bestNormalizedUnit: null,
          bestImagePath: null,
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('opens quick actions on long press', async () => {
    const screen = await render(<ProductsScreen />);

    longPressProductRow(screen, 'product-1');
    await waitFor(() => expect(screen.getByText('Edit product')).toBeTruthy());
  });
});
