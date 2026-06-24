import type { AppDatabase } from '../client';
import { createCategoryRepository } from './categories';
import { createMarketRepository } from './markets';
import { createPantryRepository } from './pantry';
import { createProductPriceRepository } from './product-prices';
import { createProductRepository } from './products';
import { createRecipeRepository } from './recipes';
import { createShoppingListRepository } from './shopping-lists';

export function createAppRepositories(db: AppDatabase) {
  return {
    categories: createCategoryRepository(db),
    markets: createMarketRepository(db),
    products: createProductRepository(db),
    productPrices: createProductPriceRepository(db),
    recipes: createRecipeRepository(db),
    shoppingLists: createShoppingListRepository(db),
    pantry: createPantryRepository(db),
  };
}

export type AppRepositories = ReturnType<typeof createAppRepositories>;
