# Foundation-First V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Grocery Cost Tracker V1 as a local-first offline Expo mobile app.

**Architecture:** Establish the shared platform, database, domain services, UI system, and i18n foundations before building feature screens. Domain behavior lives in focused TypeScript modules, SQLite repositories own persistence, and Expo Router screens compose repository hooks, form schemas, and reusable UI components.

**Tech Stack:** Expo SDK 56, React Native 0.85, React 19, TypeScript 6, SQLite, Expo File System, Expo Router, React Hook Form, Zod, NativeWind, React Native Reusables, i18next, react-i18next.

## Global Constraints

- Read the exact Expo SDK 56 docs at `https://docs.expo.dev/versions/v56.0.0/` before implementation work that touches Expo APIs.
- The app must operate completely offline.
- All user data must be stored locally on the device.
- Do not add cloud sync, accounts, authentication, barcode scanning, receipt OCR, shared lists, multi-user support, product variants, AI recommendations, push notifications, cloud backup, automatic backup, backup encryption, or backup merge/conflict resolution.
- Product prices are immutable: creating a price creates a new `ProductPrice` row and never mutates historical prices.
- Store only relative image paths in SQLite, such as `images/products/product-id.jpg` and `images/recipes/recipe-id.jpg`.
- All user-facing text must go through i18next resources for English and Spanish.
- Never translate user content: product names, product notes, category names, market names, recipe names, and recipe descriptions.
- Use locale-aware formatting for currency, numbers, and dates.
- Prevent invalid unit conversions between mass, volume, and count.
- Mobile is the V1 target. Keep existing web template support only where it does not change mobile implementation choices.

## PRD Ambiguity Defaults

- Normalized price units are `kg` for mass, `l` for volume, and `unit` for count.
- Volume conversion uses `1 tsp = 5 ml`, `1 tbsp = 15 ml`, and `1 l = 1000 ml`; mass conversion uses `1 kg = 1000 g`.
- Latest price means the greatest `observedAt`; ties resolve by newest row id.
- A recipe ingredient with no usable price makes the recipe cost incomplete and shows a localized missing-price message.
- Manual recipe pricing uses the latest price for the selected market per ingredient.
- Duplicate and Buy Again create a new draft shopping list, copy planned product, quantity, and unit values, and reset status, actuals, market, and price references.
- Marking a shopping item as bought treats `actualPrice` as the total price for `actualQuantity` and `actualUnit`; it creates a matching immutable `ProductPrice`.
- Pantry stores one item per product and converts compatible quantities into the product default unit before merging.
- Cooking a recipe consumes one full recipe batch after confirmation and creates `consume` pantry transactions.
- Category delete sets affected products to uncategorized. Product, market, and recipe deletes are blocked while dependent immutable records or active workflows reference them.

## Target File Structure

```txt
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    products/index.tsx
    markets/index.tsx
    recipes/index.tsx
    shopping/index.tsx
    pantry/index.tsx
    settings/index.tsx
  products/[productId].tsx
  products/new.tsx
  markets/[marketId].tsx
  markets/new.tsx
  recipes/[recipeId].tsx
  recipes/new.tsx
  shopping/[shoppingListId].tsx
  shopping/new.tsx
components/
  ui/
  forms/
  domain/
lib/
  db/
    client.ts
    migrations.ts
    schema.ts
    repositories/
  domain/
    units.ts
    pricing.ts
    recipes.ts
    pantry.ts
    shopping.ts
    backup.ts
  hooks/
  i18n/
    index.ts
    resources/en.ts
    resources/es.ts
  images/
  validation/
  formatting/
tests/
  domain/
  repositories/
  screens/
```

## Task 1: Project Foundation And Dependency Alignment

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `babel.config.js`
- Create: `tailwind.config.js`
- Create: `global.css`
- Modify: `app/_layout.tsx`
- Create: `tests/setup.ts`

**Interfaces:**
- Produces: Expo SDK 56 compatible app setup with NativeWind, React Native Reusables, SQLite, Expo File System, React Hook Form, Zod, i18next, and test tooling.

- [ ] Read Expo SDK 56 docs for `expo-sqlite`, `expo-file-system`, Expo Router, and any Expo module used for image or document selection.
- [ ] Install only stack-aligned runtime dependencies: `expo-sqlite`, `expo-file-system`, `react-hook-form`, `zod`, `@hookform/resolvers`, `nativewind`, `i18next`, `react-i18next`, and React Native Reusables dependencies required by its Expo guide.
- [ ] Add a ZIP implementation only inside the backup module if Expo SDK 56 has no built-in archive API; document it as a backup implementation detail, not a replacement for Expo File System.
- [ ] Add test scripts and compatible dev dependencies for TypeScript unit tests and React Native component tests.
- [ ] Configure NativeWind and global CSS according to Expo SDK 56 and NativeWind docs.
- [ ] Keep `expo-router/entry`, typed routes, and the existing Expo SDK 56 app config.
- [ ] Verify `npm run typecheck`, `npm test`, `npm run ios`, and `npm run android` commands exist or are documented with exact expected results.

## Task 2: Database Schema, Migrations, And Repository Contracts

**Files:**
- Create: `lib/db/client.ts`
- Create: `lib/db/schema.ts`
- Create: `lib/db/migrations.ts`
- Create: `lib/db/repositories/base.ts`
- Create: `lib/db/repositories/categories.ts`
- Create: `lib/db/repositories/markets.ts`
- Create: `lib/db/repositories/products.ts`
- Create: `lib/db/repositories/product-prices.ts`
- Create: `lib/db/repositories/recipes.ts`
- Create: `lib/db/repositories/shopping-lists.ts`
- Create: `lib/db/repositories/pantry.ts`
- Test: `tests/repositories/migrations.test.ts`

**Interfaces:**
- Produces: `openAppDatabase(): Promise<AppDatabase>`, `runMigrations(db): Promise<void>`, repository CRUD methods, and transaction helpers.
- Consumes: Expo SQLite from Task 1.

- [ ] Define tables for `Market`, `Category`, `Product`, `ProductPrice`, `Recipe`, `RecipeProduct`, `RecipeProductMarket`, `ShoppingList`, `ShoppingListItem`, `PantryItem`, and `PantryTransaction`.
- [ ] Use text ids generated in app code, ISO timestamps, integer booleans, and SQLite foreign keys.
- [ ] Add indexes for price lookup by product/market/date, recipe ingredient lookup, shopping item lookup, pantry lookup by product, and transaction history lookup.
- [ ] Enforce immutable prices by omitting repository update/delete methods for `ProductPrice` and covering that with tests.
- [ ] Enforce one pantry item per product with a unique index on `PantryItem.productId`.
- [ ] Implement migration versioning so future schema changes can run incrementally.
- [ ] Test that a fresh database migrates to the latest version and all required tables/indexes exist.

## Task 3: Units, Normalization, Formatting, And Validation Schemas

**Files:**
- Create: `lib/domain/units.ts`
- Create: `lib/domain/pricing.ts`
- Create: `lib/formatting/currency.ts`
- Create: `lib/formatting/date.ts`
- Create: `lib/formatting/number.ts`
- Create: `lib/validation/common.ts`
- Create: `lib/validation/products.ts`
- Create: `lib/validation/markets.ts`
- Create: `lib/validation/recipes.ts`
- Create: `lib/validation/shopping.ts`
- Create: `lib/validation/pantry.ts`
- Test: `tests/domain/units.test.ts`
- Test: `tests/domain/pricing.test.ts`

**Interfaces:**
- Produces: `convertQuantity`, `assertCompatibleUnits`, `normalizePrice`, `formatCurrency`, `formatDate`, and Zod schemas consumed by forms and services.

- [ ] Implement unit dimensions for `g`, `kg`, `ml`, `l`, `tsp`, `tbsp`, and `unit`.
- [ ] Convert only within the same dimension and return a typed error for invalid cross-dimension conversions.
- [ ] Normalize prices to price per `kg`, `l`, or `unit`.
- [ ] Add Zod schemas for every user-editable entity with localized validation keys rather than literal UI strings.
- [ ] Test mass, volume, count, invalid conversions, zero/negative quantities, and normalized price calculations.
- [ ] Implement locale-aware formatters using `Intl` with `en` and `es` support.

## Task 4: I18n And App Providers

**Files:**
- Create: `lib/i18n/index.ts`
- Create: `lib/i18n/resources/en.ts`
- Create: `lib/i18n/resources/es.ts`
- Create: `lib/hooks/use-locale.ts`
- Create: `lib/hooks/use-translated-options.ts`
- Modify: `app/_layout.tsx`
- Test: `tests/domain/i18n.test.ts`

**Interfaces:**
- Produces: initialized i18next instance, `useTranslation`, language persistence, and locale-aware formatter access.

- [ ] Detect device language on first launch, default to Spanish for Spanish devices, and English for unsupported languages.
- [ ] Persist manual language selection locally.
- [ ] Provide translations for navigation, buttons, forms, validation messages, empty states, errors, statuses, backup warnings, and success messages.
- [ ] Add tests proving all required top-level translation keys exist in both `en` and `es`.
- [ ] Add a hardcoded-string review checklist to each UI task.

## Task 5: UI System And Navigation Shell

**Files:**
- Modify: `app/(tabs)/_layout.tsx`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/dialog.tsx`
- Create: `components/ui/form-field.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/select.tsx`
- Create: `components/ui/list-row.tsx`
- Create: `components/ui/empty-state.tsx`
- Create: `components/domain/rating-input.tsx`
- Create: `components/domain/unit-input.tsx`

**Interfaces:**
- Produces: reusable NativeWind and React Native Reusables components for all feature screens.

- [ ] Replace template tabs with Products, Markets, Recipes, Shopping, Pantry, and Settings.
- [ ] Remove template copy from visible routes.
- [ ] Build reusable form and list components that accept translated labels and validation messages.
- [ ] Add empty, loading, destructive confirmation, and offline-safe error states.
- [ ] Verify mobile navigation works with typed Expo Router routes.

## Task 6: Category, Market, And Product Catalog

**Files:**
- Create: `app/(tabs)/products/index.tsx`
- Create: `app/products/new.tsx`
- Create: `app/products/[productId].tsx`
- Create: `app/(tabs)/markets/index.tsx`
- Create: `app/markets/new.tsx`
- Create: `app/markets/[marketId].tsx`
- Create: `components/domain/product-form.tsx`
- Create: `components/domain/category-form.tsx`
- Create: `components/domain/market-form.tsx`
- Create: `lib/hooks/use-products.ts`
- Create: `lib/hooks/use-categories.ts`
- Create: `lib/hooks/use-markets.ts`
- Test: `tests/screens/catalog.test.tsx`

**Interfaces:**
- Consumes: repositories, validation schemas, i18n, UI primitives, unit helpers.
- Produces: full product/category/market CRUD and product detail route.

- [ ] Implement category CRUD with uncategorized display for products whose `categoryId` is null.
- [ ] Implement market CRUD with name and address fields.
- [ ] Implement product CRUD with category assignment, default unit, rating 1-5, notes, and favorite flag.
- [ ] Add catalog filters for favorites-only and minimum rating.
- [ ] Add sorting by name, highest rated, lowest rated, and favorites first.
- [ ] Add product detail sections for information, favorite status, rating, notes, latest price, price history, and markets with prices.
- [ ] Block destructive deletes when dependent records exist and show localized explanations.

## Task 7: Local Image Storage

**Files:**
- Create: `lib/images/paths.ts`
- Create: `lib/images/storage.ts`
- Modify: `components/domain/product-form.tsx`
- Create: `components/domain/recipe-image-field.tsx`
- Test: `tests/domain/images.test.ts`

**Interfaces:**
- Produces: `saveEntityImage(entityType, entityId, sourceUri): Promise<RelativeImagePath>` and `resolveImageUri(relativePath): string`.

- [ ] Store product images under `images/products/` and recipe images under `images/recipes/`.
- [ ] Persist only relative paths in SQLite.
- [ ] Resolve relative paths to device file URIs at render time.
- [ ] Delete orphaned image files when an unused product or recipe is deleted.
- [ ] Test that absolute filesystem paths are rejected before persistence.

## Task 8: Price Management And History

**Files:**
- Create: `components/domain/price-form.tsx`
- Create: `components/domain/price-history-list.tsx`
- Modify: `app/products/[productId].tsx`
- Create: `lib/hooks/use-product-prices.ts`
- Test: `tests/domain/product-prices.test.ts`

**Interfaces:**
- Consumes: product and market repositories, `normalizePrice`.
- Produces: `createProductPrice(input): Promise<ProductPrice>` and price history queries.

- [ ] Add manual price creation from product detail.
- [ ] Require product, market, price, quantity, unit, and observed date.
- [ ] Calculate `normalizedPrice` and `normalizedUnit` before insert.
- [ ] Show latest price and full history sorted newest first.
- [ ] Show markets where prices exist for a product.
- [ ] Test that new prices append records and never mutate historical rows.

## Task 9: Recipe Management And Cost Engine

**Files:**
- Create: `app/(tabs)/recipes/index.tsx`
- Create: `app/recipes/new.tsx`
- Create: `app/recipes/[recipeId].tsx`
- Create: `components/domain/recipe-form.tsx`
- Create: `components/domain/recipe-product-form.tsx`
- Create: `components/domain/recipe-cost-breakdown.tsx`
- Create: `lib/domain/recipes.ts`
- Create: `lib/hooks/use-recipes.ts`
- Test: `tests/domain/recipes.test.ts`
- Test: `tests/screens/recipes.test.tsx`

**Interfaces:**
- Consumes: product, price, market, recipe repositories and unit conversion helpers.
- Produces: recipe CRUD, ingredient management, manual pricing, cheapest-available pricing, total cost, cost per serving, and market breakdown.

- [ ] Implement recipe CRUD with name, description, servings, pricing strategy, image, and ingredient list.
- [ ] Implement `manual` pricing by requiring a market selection for each ingredient and using latest price at that market.
- [ ] Implement `cheapest_available` pricing by choosing the lowest normalized compatible latest price across markets.
- [ ] Convert ingredient quantities to selected price units before cost calculation.
- [ ] Display pricing strategy, total cost, cost per serving, product cost breakdown, and market used.
- [ ] Display incomplete-cost state when at least one ingredient has no compatible price.
- [ ] Test manual cost, cheapest cost, missing price, incompatible units, and cost per serving.

## Task 10: Shopping Lists And Shopping Workflow

**Files:**
- Create: `app/(tabs)/shopping/index.tsx`
- Create: `app/shopping/new.tsx`
- Create: `app/shopping/[shoppingListId].tsx`
- Create: `components/domain/shopping-list-form.tsx`
- Create: `components/domain/shopping-list-item-form.tsx`
- Create: `components/domain/shopping-item-row.tsx`
- Create: `lib/domain/shopping.ts`
- Create: `lib/hooks/use-shopping-lists.ts`
- Test: `tests/domain/shopping.test.ts`
- Test: `tests/screens/shopping.test.tsx`

**Interfaces:**
- Consumes: product, market, price, pantry repositories and unit helpers.
- Produces: list CRUD, statuses, duplicate, Buy Again, pending/bought/skipped item flow, price creation on purchase, and pantry increase.

- [ ] Implement shopping list statuses `draft`, `active`, `completed`, and `archived`.
- [ ] Implement item statuses `pending`, `bought`, and `skipped`.
- [ ] Prioritize favorite products in product selectors.
- [ ] Add duplicate and Buy Again actions that copy planned quantities and reset actual shopping state.
- [ ] Mark bought only when actual quantity, actual unit, actual price, and market are present.
- [ ] In one SQLite transaction, set item bought, create immutable `ProductPrice`, update pantry, and create a `purchase` pantry transaction.
- [ ] Allow skipped items without price or pantry changes.
- [ ] Complete lists after all items are bought or skipped.
- [ ] Test transaction rollback if price creation or pantry update fails.

## Task 11: Pantry Inventory And Recipe Cooking

**Files:**
- Create: `app/(tabs)/pantry/index.tsx`
- Create: `components/domain/pantry-adjustment-form.tsx`
- Create: `components/domain/pantry-transaction-list.tsx`
- Modify: `app/recipes/[recipeId].tsx`
- Create: `lib/domain/pantry.ts`
- Create: `lib/hooks/use-pantry.ts`
- Test: `tests/domain/pantry.test.ts`
- Test: `tests/screens/pantry.test.tsx`

**Interfaces:**
- Consumes: pantry repository, recipe repository, unit conversion helpers.
- Produces: inventory view, manual add/remove/adjust, transaction log, and recipe cook consumption.

- [ ] Show current inventory grouped by product.
- [ ] Implement manual add, remove, adjustment, and waste actions.
- [ ] Record every inventory change as a `PantryTransaction`.
- [ ] Merge compatible purchase quantities into one pantry item per product.
- [ ] Add a localized Cook Recipe action on recipe detail.
- [ ] On cook confirmation, decrease pantry by one full recipe batch and create `consume` transactions.
- [ ] Block cooking when required pantry items are missing or incompatible and show the missing product list.
- [ ] Test purchase, adjustment, waste, cook success, and cook blocked states.

## Task 12: Backup Export And Import

**Files:**
- Create: `lib/domain/backup.ts`
- Create: `components/domain/backup-actions.tsx`
- Modify: `app/(tabs)/settings/index.tsx`
- Test: `tests/domain/backup.test.ts`

**Interfaces:**
- Consumes: SQLite database path, image storage paths, Expo File System.
- Produces: `exportBackup(): Promise<BackupExportResult>` and `importBackup(archiveUri): Promise<void>`.

- [ ] Export `backup.zip` containing `manifest.json`, `database.sqlite`, and `images/products` plus `images/recipes`.
- [ ] Write manifest fields `appName`, `backupVersion`, `exportedAt`, `databaseFile`, and `imageDirectory`.
- [ ] Import only after explicit localized confirmation: `Importing this backup will replace all current local data.`
- [ ] Validate archive exists, manifest exists, backup version is supported, and database file exists before replacing data.
- [ ] Cancel import without changing current data when validation fails.
- [ ] Replace current local data only after the full archive has been validated and staged.
- [ ] Test successful export, validation failures, and full restore replacement.

## Task 13: Settings, Polish, And Release Verification

**Files:**
- Create: `app/(tabs)/settings/index.tsx`
- Modify: `lib/i18n/resources/en.ts`
- Modify: `lib/i18n/resources/es.ts`
- Modify: `app.json`
- Create: `tests/screens/settings.test.tsx`

**Interfaces:**
- Consumes: i18n, backup service, app config.
- Produces: settings screen with language selector, export, import, and app version.

- [ ] Add language selector for English and Spanish.
- [ ] Show application version from app config.
- [ ] Wire export and import actions with localized success, failure, and confirmation messages.
- [ ] Review every screen for hardcoded user-facing strings.
- [ ] Verify all PRD success criteria manually on iOS and Android simulators.
- [ ] Run `npm test`, `npm run typecheck`, `npm run ios`, and `npm run android` before calling V1 complete.

## Final Acceptance Checklist

- [ ] Users can manage products and categories.
- [ ] Users can track historical product prices.
- [ ] Users can rate products and add notes.
- [ ] Users can mark products as favorites.
- [ ] Users can create recipes and calculate costs.
- [ ] Users can use manual or cheapest-available pricing.
- [ ] Users can shop using reusable shopping lists.
- [ ] Users can update prices while shopping.
- [ ] Users can maintain pantry inventory.
- [ ] Users can export complete backups.
- [ ] Users can import complete backups.
- [ ] Users can switch between English and Spanish.
- [ ] Users can use the application entirely offline.
