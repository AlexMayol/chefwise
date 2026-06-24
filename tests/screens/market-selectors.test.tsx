import { render } from '@testing-library/react-native';

import { RecipeProductForm } from '@/components/domain/recipe-product-form';
import { ShoppingPurchaseForm } from '@/components/domain/shopping-purchase-form';
import type { Market } from '@/lib/db/repositories/markets';
import type { Product } from '@/lib/db/repositories/products';
import type { ShoppingListItem } from '@/lib/db/repositories/shopping-lists';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useProducts } from '@/lib/hooks/use-products';

jest.mock('@/lib/hooks/use-markets', () => ({
  useMarkets: jest.fn(),
}));

jest.mock('@/lib/hooks/use-products', () => ({
  useProducts: jest.fn(),
}));

const useMarketsMock = useMarkets as jest.MockedFunction<typeof useMarkets>;
const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;

const product: Product = {
  id: 'flour',
  name: 'Bread flour',
  categoryId: null,
  defaultUnit: 'kg',
  rating: null,
  notes: null,
  isFavorite: true,
  imagePath: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const markets: Market[] = [
  { id: 'central', name: 'Central Market', address: 'Main St', createdAt: '', updatedAt: '' },
  { id: 'corner', name: 'Corner Shop', address: null, createdAt: '', updatedAt: '' },
];

const shoppingItem: ShoppingListItem = {
  id: 'item-1',
  shoppingListId: 'list-1',
  productId: 'flour',
  plannedQuantity: 1,
  plannedUnit: 'kg',
  status: 'pending',
  actualQuantity: null,
  actualUnit: null,
  actualPrice: null,
  marketId: null,
  productPriceId: null,
  createdAt: '',
  updatedAt: '',
};

describe('market selectors', () => {
  beforeEach(() => {
    useProductsMock.mockReturnValue({
      items: [product],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });
    useMarketsMock.mockReturnValue({
      items: markets,
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses market choices in recipe ingredient forms', async () => {
    const screen = await render(<RecipeProductForm recipeId="recipe-1" onSubmit={jest.fn()} />);

    expect(screen.getByText('Central Market')).toBeTruthy();
    expect(screen.getByText('Corner Shop')).toBeTruthy();
    expect(useMarketsMock).toHaveBeenCalled();
  });

  it('uses market choices in shopping purchase forms', async () => {
    const screen = await render(<ShoppingPurchaseForm item={shoppingItem} onBought={jest.fn()} onSkipped={jest.fn()} />);

    expect(screen.getByText('Central Market')).toBeTruthy();
    expect(screen.getByText('Corner Shop')).toBeTruthy();
    expect(useMarketsMock).toHaveBeenCalled();
  });
});
