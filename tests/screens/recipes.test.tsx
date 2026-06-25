import { render, waitFor } from '@testing-library/react-native';

import RecipeDetailScreen from '@/app/recipes/[recipeId]';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useProducts } from '@/lib/hooks/use-products';
import { useRecipeDetail } from '@/lib/hooks/use-recipes';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useLocalSearchParams: () => ({ recipeId: 'recipe-1' }),
}));

jest.mock('@/lib/hooks/use-markets', () => ({
  useMarkets: jest.fn(),
}));

jest.mock('@/lib/hooks/use-products', () => ({
  useProducts: jest.fn(),
}));

jest.mock('@/lib/hooks/use-recipes', () => ({
  useRecipeDetail: jest.fn(),
}));

const useMarketsMock = useMarkets as jest.MockedFunction<typeof useMarkets>;
const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;
const useRecipeDetailMock = useRecipeDetail as jest.MockedFunction<typeof useRecipeDetail>;

describe('recipe screens', () => {
  beforeEach(() => {
    useProductsMock.mockReturnValue({
      items: [
        {
          id: 'flour',
          name: 'Bread flour',
          categoryId: null,
          marketId: 'central',
          defaultUnit: 'kg',
          rating: null,
          notes: null,
          isFavorite: true,
          imagePath: null,
          createdAt: '',
          updatedAt: '',
          marketName: null,
          price: null,
          normalizedPrice: null,
          normalizedUnit: null,
        },
      ],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      assign: jest.fn(),
    });
    useMarketsMock.mockReturnValue({
      items: [{ id: 'central', name: 'Central Market', address: null, imagePath: null, createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });
    useRecipeDetailMock.mockReturnValue({
      recipe: {
        id: 'recipe-1',
        name: 'Pancakes',
        description: null,
        servings: 2,
        imagePath: null,
        createdAt: '',
        updatedAt: '',
      },
      ingredients: [
        {
          id: 'ingredient-1',
          recipeId: 'recipe-1',
          productId: 'flour',
          quantity: 500,
          unit: 'g',
          createdAt: '',
          updatedAt: '',
        },
      ],
      loading: false,
      reload: jest.fn(),
      addIngredient: jest.fn(),
      cook: jest.fn(),
      remove: jest.fn(),
      calculateCost: jest.fn(async () => ({
        complete: true,
        totalCost: 1,
        costPerServing: 0.5,
        missingProductIds: [],
        breakdown: [{ productId: 'flour', priceId: 'price-1', cost: 1 }],
      })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows product context for recipe cost breakdown items', async () => {
    const screen = await render(<RecipeDetailScreen />);

    await waitFor(() => expect(screen.getAllByText('Bread flour').length).toBeGreaterThan(0));
    expect(screen.getAllByText('€1.00').length).toBeGreaterThan(0);
  });
});
