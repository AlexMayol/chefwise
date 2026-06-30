import { fireEvent, render, waitFor } from '@testing-library/react-native';

import RecipesScreen from '@/app/(tabs)/recipes';
import RecipeDetailScreen from '@/app/recipes/[recipeId]';
import { useProducts } from '@/lib/hooks/use-products';
import { useRecipeCategories } from '@/lib/hooks/use-recipe-categories';
import { useRecipeDetail, useRecipeOverviews } from '@/lib/hooks/use-recipes';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useLocalSearchParams: () => ({ recipeId: 'recipe-1' }),
  useFocusEffect: (effect: () => void | (() => void)) => {
    effect();
  },
}));

jest.mock('@/lib/hooks/use-products', () => ({ useProducts: jest.fn() }));
jest.mock('@/lib/hooks/use-recipe-categories', () => ({ useRecipeCategories: jest.fn() }));
jest.mock('@/lib/hooks/use-recipes', () => ({
  useRecipeDetail: jest.fn(),
  useRecipeOverviews: jest.fn(),
}));

const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;
const useRecipeCategoriesMock = useRecipeCategories as jest.MockedFunction<typeof useRecipeCategories>;
const useRecipeDetailMock = useRecipeDetail as jest.MockedFunction<typeof useRecipeDetail>;
const useRecipeOverviewsMock = useRecipeOverviews as jest.MockedFunction<typeof useRecipeOverviews>;

const categories = {
  items: [{ id: 'cat-main', name: 'Main dishes', emoji: '🍝', description: null, sortOrder: 0, createdAt: '', updatedAt: '' }],
  loading: false,
  reload: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeMany: jest.fn(),
};

beforeEach(() => {
  useProductsMock.mockReturnValue({
    items: [
      {
        id: 'flour',
        name: 'Bread flour',
        categoryId: null,
        defaultUnit: 'kg',
        isFavorite: true,
        createdAt: '',
        updatedAt: '',
        offerCount: 0,
        marketCount: 0,
        bestPrice: null,
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
  useRecipeCategoriesMock.mockReturnValue(categories);
});

afterEach(() => jest.clearAllMocks());

describe('recipes listing', () => {
  beforeEach(() => {
    useRecipeOverviewsMock.mockReturnValue({
      items: [
        {
          id: 'recipe-1',
          name: 'Spaghetti Bolognese',
          description: null,
          servings: 4,
          recipeCategoryId: 'cat-main',
          isFavorite: true,
          imagePath: null,
          createdAt: '',
          updatedAt: '2026-06-28T00:00:00.000Z',
          totalCost: 4.78,
          costPerServing: 1.2,
          complete: true,
          ingredientCount: 5,
          ingredientEmojis: ['🍅', '🧅'],
        },
        {
          id: 'recipe-2',
          name: 'Greek Salad',
          description: null,
          servings: 2,
          recipeCategoryId: null,
          isFavorite: false,
          imagePath: null,
          createdAt: '',
          updatedAt: '2026-06-20T00:00:00.000Z',
          totalCost: null,
          costPerServing: null,
          complete: false,
          ingredientCount: 3,
          ingredientEmojis: ['🥗'],
        },
      ],
      loading: false,
      reload: jest.fn(),
      toggleFavorite: jest.fn(),
    });
  });

  it('renders recipe cards with name and total cost', async () => {
    const screen = await render(<RecipesScreen />);
    // Favorited recipes are prefixed with a ★ (same pattern as product cards).
    expect(screen.getByText('★ Spaghetti Bolognese')).toBeTruthy();
    expect(screen.getByText('€4.78')).toBeTruthy();
    expect(screen.getByText('Greek Salad')).toBeTruthy();
  });

  it('filters to favorites when the Favorites chip is pressed', async () => {
    const screen = await render(<RecipesScreen />);
    fireEvent.press(screen.getByLabelText('Favorites'));
    await waitFor(() => expect(screen.queryByText('Greek Salad')).toBeNull());
    expect(screen.getByText('★ Spaghetti Bolognese')).toBeTruthy();
  });
});

describe('recipe detail', () => {
  beforeEach(() => {
    useRecipeDetailMock.mockReturnValue({
      recipe: {
        id: 'recipe-1',
        name: 'Pancakes',
        description: null,
        servings: 2,
        recipeCategoryId: 'cat-main',
        isFavorite: false,
        imagePath: null,
        createdAt: '',
        updatedAt: '',
      },
      ingredients: [
        { id: 'ingredient-1', recipeId: 'recipe-1', productId: 'flour', offerId: null, quantity: 500, unit: 'g', createdAt: '', updatedAt: '' },
      ],
      loading: false,
      reload: jest.fn(),
      addIngredient: jest.fn(),
      save: jest.fn(),
      toggleFavorite: jest.fn(),
      cook: jest.fn(),
      remove: jest.fn(),
      calculateCost: jest.fn(async () => ({
        complete: true,
        totalCost: 1,
        costPerServing: 0.5,
        missingProductIds: [],
        breakdown: [{ productId: 'flour', offerId: 'offer-1', priceId: 'price-1', cost: 1 }],
      })),
    });
  });

  it('shows product context for recipe cost breakdown items', async () => {
    const screen = await render(<RecipeDetailScreen />);
    await waitFor(() => expect(screen.getAllByText('Bread flour').length).toBeGreaterThan(0));
    expect(screen.getAllByText('€1.00').length).toBeGreaterThan(0);
  });
});
