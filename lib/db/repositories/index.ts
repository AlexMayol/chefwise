import type { AppDatabase } from '../client';
import { createCategoryRepository } from './categories';
import { createMarketRepository } from './markets';
import { createPantryRepository } from './pantry';
import { createProductOfferRepository } from './product-offers';
import { createProductPriceRepository } from './product-prices';
import { createProductRepository } from './products';
import { createRecipeCategoryRepository } from './recipe-categories';
import { createRecipeRepository } from './recipes';
import { createShoppingListRepository } from './shopping-lists';

export function createAppRepositories(db: AppDatabase) {
  return {
    categories: createCategoryRepository(db),
    markets: createMarketRepository(db),
    products: createProductRepository(db),
    productOffers: createProductOfferRepository(db),
    // Kept for the shopping "bought" flow only; the catalog/recipes use offers now.
    productPrices: createProductPriceRepository(db),
    recipeCategories: createRecipeCategoryRepository(db),
    recipes: createRecipeRepository(db),
    shoppingLists: createShoppingListRepository(db),
    pantry: createPantryRepository(db),
  };
}

export type AppRepositories = ReturnType<typeof createAppRepositories>;
