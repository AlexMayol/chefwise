import { render } from '@testing-library/react-native';

import { PantryAdjustmentForm } from '@/components/domain/pantry-adjustment-form';
import { RecipeProductForm } from '@/components/domain/recipe-product-form';
import { ShoppingListItemForm } from '@/components/domain/shopping-list-item-form';
import type { ProductListItem } from '@/lib/db/repositories/products';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useProducts } from '@/lib/hooks/use-products';

jest.mock('@/lib/hooks/use-markets', () => ({
  useMarkets: jest.fn(),
}));

jest.mock('@/lib/hooks/use-products', () => ({
  useProducts: jest.fn(),
}));

jest.mock('@/lib/hooks/use-product-offers', () => ({
  useProductOffers: jest.fn(() => ({
    items: [],
    loading: false,
    reload: jest.fn(),
    create: jest.fn(),
    createWithPrice: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

const useMarketsMock = useMarkets as jest.MockedFunction<typeof useMarkets>;
const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;

const products: ProductListItem[] = [
  {
    id: 'rice',
    name: 'Favorite rice',
    categoryId: null,
    defaultUnit: 'kg',
    isFavorite: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    offerCount: 0,
    marketCount: 0,
    bestNormalizedPrice: null,
    bestNormalizedUnit: null,
    bestImagePath: null,
  },
  {
    id: 'oats',
    name: 'Plain oats',
    categoryId: null,
    defaultUnit: 'kg',
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    offerCount: 0,
    marketCount: 0,
    bestNormalizedPrice: null,
    bestNormalizedUnit: null,
    bestImagePath: null,
  },
];

describe('product selectors', () => {
  beforeEach(() => {
    useMarketsMock.mockReturnValue({
      items: [],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
    });
    useProductsMock.mockReturnValue({
      items: products,
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

  it('uses favorite-first product choices in recipe ingredient forms', async () => {
    const recipe = await render(<RecipeProductForm recipeId="recipe-1" onSubmit={jest.fn()} />);
    expect(recipe.getByText('Favorite rice')).toBeTruthy();
    expect(recipe.getByText('Plain oats')).toBeTruthy();

    expect(useProductsMock).toHaveBeenCalledWith({ sort: 'favorites_first' });
  });

  it('uses favorite-first product choices in shopping item forms', async () => {
    const shopping = await render(<ShoppingListItemForm shoppingListId="list-1" onSubmit={jest.fn()} />);
    expect(shopping.getByText('Favorite rice')).toBeTruthy();
    expect(shopping.getByText('Plain oats')).toBeTruthy();

    expect(useProductsMock).toHaveBeenCalledWith({ sort: 'favorites_first' });
  });

  it('uses favorite-first product choices in pantry adjustment forms', async () => {
    const pantry = await render(<PantryAdjustmentForm onSubmit={jest.fn()} />);
    expect(pantry.getByText('Favorite rice')).toBeTruthy();
    expect(pantry.getByText('Plain oats')).toBeTruthy();

    expect(useProductsMock).toHaveBeenCalledWith({ sort: 'favorites_first' });
  });
});
