import { fireEvent, render } from '@testing-library/react-native';

import ProductsScreen from '@/app/(tabs)/products';
import RecipesScreen from '@/app/(tabs)/recipes';
import { useCategories } from '@/lib/hooks/use-categories';
import { useRecipeCategories } from '@/lib/hooks/use-recipe-categories';
import { useRecipeOverviews } from '@/lib/hooks/use-recipes';
import { useProducts } from '@/lib/hooks/use-products';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useFocusEffect: (effect: () => void | (() => void)) => {
    effect();
  },
}));

jest.mock('@/lib/hooks/use-products', () => ({ useProducts: jest.fn() }));
jest.mock('@/lib/hooks/use-categories', () => ({ useCategories: jest.fn() }));
jest.mock('@/lib/hooks/use-recipe-categories', () => ({ useRecipeCategories: jest.fn() }));
jest.mock('@/lib/hooks/use-recipes', () => ({ useRecipeOverviews: jest.fn() }));

const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;
const useCategoriesMock = useCategories as jest.MockedFunction<typeof useCategories>;
const useRecipeCategoriesMock = useRecipeCategories as jest.MockedFunction<typeof useRecipeCategories>;
const useRecipeOverviewsMock = useRecipeOverviews as jest.MockedFunction<typeof useRecipeOverviews>;

const recipeCategories = {
  items: [{ id: 'cat-main', name: 'Main dishes', emoji: '🍝', description: null, sortOrder: 0, createdAt: '', updatedAt: '' }],
  loading: false,
  reload: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeMany: jest.fn(),
};

function recipeOverview(id: string, name: string) {
  return {
    id,
    name,
    description: null,
    servings: 4,
    recipeCategoryId: 'cat-main',
    isFavorite: false,
    imagePath: null,
    createdAt: '',
    updatedAt: '2026-06-28T00:00:00.000Z',
    totalCost: 4.78,
    costPerServing: 1.2,
    complete: true,
    ingredientCount: 2,
    ingredientEmojis: ['🍅'],
  };
}

function product(id: string, name: string, categoryId: string | null = 'cat-1') {
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
    bestPrice: null,
    bestNormalizedPrice: null,
    bestNormalizedUnit: null,
    bestImagePath: null,
  };
}

beforeEach(() => {
  useRecipeCategoriesMock.mockReturnValue(recipeCategories);
  useCategoriesMock.mockReturnValue({
    items: [{ id: 'cat-1', name: 'Dairy', description: '🧀', createdAt: '', updatedAt: '' }],
    loading: false,
    reload: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeMany: jest.fn(),
  });
});

afterEach(() => jest.clearAllMocks());

describe('listing create actions', () => {
  describe('recipes screen', () => {
    beforeEach(() => {
      useRecipeOverviewsMock.mockReturnValue({
        items: Array.from({ length: 6 }, (_, index) => recipeOverview(`recipe-${index}`, `Recipe ${index}`)),
        loading: false,
        reload: jest.fn(),
        toggleFavorite: jest.fn(),
      });
    });

    it('always shows the header new button', async () => {
      const screen = await render(<RecipesScreen />);
      expect(screen.getAllByText('New recipe').length).toBeGreaterThanOrEqual(1);
    });

    it('shows a list footer new item when there are more than five recipes and search is empty', async () => {
      const screen = await render(<RecipesScreen />);
      expect(screen.getAllByText('New recipe').length).toBe(2);
    });

    it('hides the list footer new item at five recipes or fewer', async () => {
      useRecipeOverviewsMock.mockReturnValue({
        items: Array.from({ length: 5 }, (_, index) => recipeOverview(`recipe-${index}`, `Recipe ${index}`)),
        loading: false,
        reload: jest.fn(),
        toggleFavorite: jest.fn(),
      });

      const screen = await render(<RecipesScreen />);
      expect(screen.getAllByText('New recipe').length).toBe(1);
    });

    it('hides the list footer new item while search is active even with many recipes', async () => {
      const screen = await render(<RecipesScreen />);
      await fireEvent.changeText(screen.getByPlaceholderText('Search recipes'), 'Recipe 0');
      expect(screen.getAllByText('New recipe').length).toBe(1);
    });

    it('shows a body new button when search returns no results', async () => {
      const screen = await render(<RecipesScreen />);
      await fireEvent.changeText(screen.getByPlaceholderText('Search recipes'), 'missing');
      expect(screen.getAllByText('New recipe').length).toBe(2);
    });

    it('shows only the header new button when the list is empty and search is inactive', async () => {
      useRecipeOverviewsMock.mockReturnValue({
        items: [],
        loading: false,
        reload: jest.fn(),
        toggleFavorite: jest.fn(),
      });

      const screen = await render(<RecipesScreen />);
      expect(screen.getAllByText('New recipe').length).toBe(1);
    });
  });

  describe('products screen', () => {
    beforeEach(() => {
      useProductsMock.mockReturnValue({
        items: Array.from({ length: 6 }, (_, index) => product(`product-${index}`, `Product ${index}`)),
        loading: false,
        reload: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        removeMany: jest.fn(),
        assign: jest.fn(),
      });
    });

    it('shows a list footer new item when there are more than five products and search is empty', async () => {
      const screen = await render(<ProductsScreen />);
      expect(screen.getAllByText('New product').length).toBe(2);
    });

    it('shows a body new button when search returns no products', async () => {
      const screen = await render(<ProductsScreen />);
      await fireEvent.changeText(screen.getByPlaceholderText('Search products'), 'missing');
      expect(screen.getAllByText('New product').length).toBe(2);
    });
  });
});
