import { fireEvent, render } from '@testing-library/react-native';

import CategoriesScreen from '@/app/(tabs)/categories';
import { useCategories } from '@/lib/hooks/use-categories';
import { useProducts } from '@/lib/hooks/use-products';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
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
    defaultUnit: 'unit' as const,
    isFavorite: false,
    createdAt: '',
    updatedAt: '',
    offerCount: 0,
    marketCount: 0,
    bestNormalizedPrice: null,
    bestNormalizedUnit: null,
    bestImagePath: null,
  };
}

describe('categories screen', () => {
  beforeEach(() => {
    useCategoriesMock.mockReturnValue({
      items: [
        { id: 'category-1', name: 'Postres', description: '🍰', createdAt: '', updatedAt: '' },
        { id: 'category-2', name: 'Bebidas', description: '🥤', createdAt: '', updatedAt: '' },
      ],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
    });
    useProductsMock.mockReturnValue({
      items: [product('product-1', 'Tiramisu', 'category-1'), product('product-2', 'Cola', 'category-2')],
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

  it('lists categories with their product counts', async () => {
    const screen = await render(<CategoriesScreen />);

    expect(screen.getByText('Postres')).toBeTruthy();
    expect(screen.getByText('Bebidas')).toBeTruthy();
    // One product is linked to each category.
    expect(screen.getAllByText('1 product').length).toBe(2);
  });

  it('filters categories by the search query', async () => {
    const screen = await render(<CategoriesScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('Search categories'), 'Bebi');

    expect(screen.getByText('Bebidas')).toBeTruthy();
    expect(screen.queryByText('Postres')).toBeNull();
  });
});
