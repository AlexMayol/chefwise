import { fireEvent, render } from '@testing-library/react-native';

import CategoryDetailScreen from '@/app/categories/[categoryId]';
import { useCategories } from '@/lib/hooks/use-categories';
import { useProducts } from '@/lib/hooks/use-products';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useLocalSearchParams: () => ({ categoryId: 'category-1' }),
  useRouter: () => ({ back: jest.fn() }),
  useFocusEffect: (effect: () => void | (() => void)) => {
    effect();
  },
}));

jest.mock('@/lib/hooks/use-categories', () => ({
  useCategories: jest.fn(),
}));

jest.mock('@/lib/hooks/use-products', () => ({
  useProducts: jest.fn(),
}));

const useCategoriesMock = useCategories as jest.MockedFunction<typeof useCategories>;
const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;

function product(id: string, name: string, categoryId: string | null) {
  return {
    id,
    name,
    categoryId,
    marketId: 'market-1',
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

describe('category detail screen', () => {
  const update = jest.fn(async () => undefined);

  beforeEach(() => {
    update.mockClear();
    useCategoriesMock.mockReturnValue({
      items: [{ id: 'category-1', name: 'Postres', description: '🍰', createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update,
      remove: jest.fn(),
    });
    useProductsMock.mockReturnValue({
      items: [product('product-1', 'Tiramisu', 'category-1'), product('product-2', 'Bread', 'category-2')],
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

  it('lists only the products linked to the category', async () => {
    const screen = await render(<CategoryDetailScreen />);

    expect(screen.getByText('Tiramisu')).toBeTruthy();
    expect(screen.queryByText('Bread')).toBeNull();
  });

  it('opens the edit flow and saves changes', async () => {
    const screen = await render(<CategoryDetailScreen />);

    await fireEvent.press(screen.getByLabelText('Edit'));
    await fireEvent.changeText(screen.getByDisplayValue('Postres'), 'Desserts');
    await fireEvent.press(screen.getByText('Save'));

    expect(update).toHaveBeenCalledWith('category-1', { name: 'Desserts', description: '🍰' });
  });
});
