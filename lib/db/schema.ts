export const LATEST_SCHEMA_VERSION = 8;

export const REQUIRED_TABLES = [
  'markets',
  'categories',
  'products',
  'product_offers',
  'product_offer_prices',
  'product_prices',
  'recipes',
  'recipe_products',
  'shopping_lists',
  'shopping_list_items',
  'pantry_items',
  'pantry_transactions',
] as const;

export const REQUIRED_INDEXES = [
  'idx_product_offers_product',
  'idx_product_offer_prices_lookup',
  'idx_product_prices_lookup',
  'idx_recipe_products_recipe',
  'idx_shopping_list_items_list',
  'idx_pantry_transactions_product',
] as const;

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS markets (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  imagePath TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- A product is now generic (Tomato). Its market/brand/size — and how it looks, rates,
-- and is described — all live per-offer (they vary by where you buy it).
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  categoryId TEXT,
  defaultUnit TEXT NOT NULL,
  isFavorite INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

-- A specific offer for a product in a market: brand (optional) + size (quantity/unit),
-- plus the rating, photo, and description that describe it at that market.
CREATE TABLE IF NOT EXISTS product_offers (
  id TEXT PRIMARY KEY NOT NULL,
  productId TEXT NOT NULL,
  marketId TEXT NOT NULL,
  brand TEXT,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  rating INTEGER,
  imagePath TEXT,
  description TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (marketId) REFERENCES markets(id) ON DELETE RESTRICT
);

-- Price history per offer. ponytail: normalizedPrice is computed at insert from the
-- offer's quantity/unit (same pattern as product_prices); the offer's "current" price
-- shown in comparison views is the latest row via window-join, not a stored field.
CREATE TABLE IF NOT EXISTS product_offer_prices (
  id TEXT PRIMARY KEY NOT NULL,
  offerId TEXT NOT NULL,
  price REAL NOT NULL,
  normalizedPrice REAL NOT NULL,
  normalizedUnit TEXT NOT NULL,
  observedAt TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (offerId) REFERENCES product_offers(id) ON DELETE CASCADE
);

-- Legacy product-level price ledger. Kept untouched for the shopping "bought" flow;
-- the catalog/recipes now use product_offer_prices.
CREATE TABLE IF NOT EXISTS product_prices (
  id TEXT PRIMARY KEY NOT NULL,
  productId TEXT NOT NULL,
  price REAL NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  normalizedPrice REAL NOT NULL,
  normalizedUnit TEXT NOT NULL,
  observedAt TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  servings REAL NOT NULL,
  imagePath TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_products (
  id TEXT PRIMARY KEY NOT NULL,
  recipeId TEXT NOT NULL,
  productId TEXT NOT NULL,
  offerId TEXT,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (offerId) REFERENCES product_offers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS shopping_lists (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS shopping_list_items (
  id TEXT PRIMARY KEY NOT NULL,
  shoppingListId TEXT NOT NULL,
  productId TEXT NOT NULL,
  plannedQuantity REAL NOT NULL,
  plannedUnit TEXT NOT NULL,
  status TEXT NOT NULL,
  actualQuantity REAL,
  actualUnit TEXT,
  actualPrice REAL,
  productPriceId TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (shoppingListId) REFERENCES shopping_lists(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (productPriceId) REFERENCES product_prices(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pantry_items (
  id TEXT PRIMARY KEY NOT NULL,
  productId TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pantry_transactions (
  id TEXT PRIMARY KEY NOT NULL,
  productId TEXT NOT NULL,
  pantryItemId TEXT,
  type TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  occurredAt TEXT NOT NULL,
  note TEXT,
  shoppingListItemId TEXT,
  recipeId TEXT,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (pantryItemId) REFERENCES pantry_items(id) ON DELETE SET NULL,
  FOREIGN KEY (shoppingListItemId) REFERENCES shopping_list_items(id) ON DELETE SET NULL,
  FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_product_offers_product
  ON product_offers(productId);
CREATE INDEX IF NOT EXISTS idx_product_offer_prices_lookup
  ON product_offer_prices(offerId, observedAt DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_product_prices_lookup
  ON product_prices(productId, observedAt DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_recipe_products_recipe
  ON recipe_products(recipeId, productId);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list
  ON shopping_list_items(shoppingListId, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pantry_items_product
  ON pantry_items(productId);
CREATE INDEX IF NOT EXISTS idx_pantry_transactions_product
  ON pantry_transactions(productId, occurredAt DESC);
`;
