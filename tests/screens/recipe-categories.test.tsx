import { render } from '@testing-library/react-native';

import RecipeCategoriesScreen from '@/app/recipe-categories';
import { useRecipeCategories } from '@/lib/hooks/use-recipe-categories';
import { useRecipes } from '@/lib/hooks/use-recipes';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useFocusEffect: (effect: () => void | (() => void)) => {
    effect();
  },
}));

jest.mock('@/lib/hooks/use-recipe-categories', () => ({ useRecipeCategories: jest.fn() }));
jest.mock('@/lib/hooks/use-recipes', () => ({ useRecipes: jest.fn() }));

const useRecipeCategoriesMock = useRecipeCategories as jest.MockedFunction<typeof useRecipeCategories>;
const useRecipesMock = useRecipes as jest.MockedFunction<typeof useRecipes>;

beforeEach(() => {
  useRecipeCategoriesMock.mockReturnValue({
    items: [
      { id: 'cat-main', name: 'Main dishes', emoji: '🍝', description: null, sortOrder: 0, createdAt: '', updatedAt: '' },
      { id: 'cat-dessert', name: 'Desserts', emoji: '🍰', description: null, sortOrder: 1, createdAt: '', updatedAt: '' },
    ],
    loading: false,
    reload: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeMany: jest.fn(),
  });
  useRecipesMock.mockReturnValue({
    items: [
      { id: 'r1', name: 'Spaghetti', description: null, servings: 4, recipeCategoryId: 'cat-main', isFavorite: false, imagePath: null, createdAt: '', updatedAt: '' },
      { id: 'r2', name: 'Loose', description: null, servings: 1, recipeCategoryId: null, isFavorite: false, imagePath: null, createdAt: '', updatedAt: '' },
    ],
    loading: false,
    reload: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeMany: jest.fn(),
    createWithIngredients: jest.fn(),
  });
});

afterEach(() => jest.clearAllMocks());

describe('recipe categories management', () => {
  it('lists categories with recipe counts and an uncategorized row', async () => {
    const screen = await render(<RecipeCategoriesScreen />);
    expect(screen.getByText('Main dishes')).toBeTruthy();
    expect(screen.getByText('Desserts')).toBeTruthy();
    expect(screen.getByText('Uncategorized')).toBeTruthy();
    // cat-main has one recipe, uncategorized has one recipe
    expect(screen.getAllByText('1 recipe').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('0 recipes')).toBeTruthy(); // Desserts
  });
});
