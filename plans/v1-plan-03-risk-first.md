# Risk-First V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Grocery Cost Tracker V1 by proving the riskiest offline data, pricing, pantry, backup, and i18n behavior early.

**Architecture:** Start with executable domain and persistence proofs for the parts most likely to cause rework: SQLite migrations, immutable price history, unit normalization, recipe costing, shopping-to-pantry transactions, image path handling, and full backup restore. Once these are stable, build the Expo Router screens on top of the proven contracts.

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

## Risk Decisions Locked Up Front

- Normalized price units are `kg`, `l`, and `unit`.
- `tsp` and `tbsp` convert through milliliters with `1 tsp = 5 ml` and `1 tbsp = 15 ml`.
- Immutable `ProductPrice` rows have create and read repository methods only.
- Missing recipe prices produce incomplete cost state and block misleading totals.
- Bought shopping items create a price, update the item, increase pantry, and record a pantry transaction in one SQLite transaction.
- Backup import validates into a staged location before replacing current data.
- Product and recipe image paths are relative in SQLite and resolved through Expo File System at render time.
- Language switching changes app chrome and labels only, never user content.

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
    shopping.ts
    pantry.ts
    backup.ts
  i18n/
  images/
  validation/
  formatting/
tests/
  domain/
  repositories/
  screens/
```

## Phase 1: Prove Expo SDK 56 Platform Choices

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `babel.config.js`
- Create: `tailwind.config.js`
- Create: `global.css`
- Create: `tests/setup.ts`
- Modify: `app/_layout.tsx`

**Interfaces:**
- Produces: confirmed SDK 56 compatible setup for SQLite, File System, Expo Router, NativeWind, forms, validation, i18n, and tests.

- [ ] Read Expo SDK 56 docs for SQLite, File System, Router, splash screen, and any Expo module needed for picking or sharing local backup/image files.
- [ ] Install runtime dependencies from the PRD stack: `expo-sqlite`, `expo-file-system`, `react-hook-form`, `zod`, `@hookform/resolvers`, `nativewind`, React Native Reusables dependencies, `i18next`, and `react-i18next`.
- [ ] Add test and typecheck tooling without changing the runtime stack.
- [ ] Configure NativeWind with Expo SDK 56.
- [ ] Keep the existing `expo-router/entry` app entry and typed routes.
- [ ] Start the app with a minimal provider tree and no domain screens.
- [ ] Verify iOS and Android startup before domain code is added.

## Phase 2: Prove SQLite Schema, Migrations, And Referential Rules

**Files:**
- Create: `lib/db/client.ts`
- Create: `lib/db/schema.ts`
- Create: `lib/db/migrations.ts`
- Create: `lib/db/repositories/base.ts`
- Create: `tests/repositories/migrations.test.ts`

**Interfaces:**
- Produces: `AppDatabase`, `runMigrations`, transaction helper, and schema constants used by every repository.

- [ ] Create tables for all 11 PRD entities in the first migration.
- [ ] Enable SQLite foreign keys during database initialization.
- [ ] Add indexes for price history, latest price, recipe products, shopping items, pantry product lookup, and pantry transactions.
- [ ] Add a unique index enforcing one pantry item per product.
- [ ] Use restrictive delete rules for products, markets, and recipes that have dependent immutable or active records.
- [ ] Use `ON DELETE SET NULL` for product category references so deleted categories become uncategorized.
- [ ] Test migration idempotency and schema creation on an empty database.
- [ ] Test foreign key enforcement and restrictive delete behavior.

## Phase 3: Prove Unit Normalization And Price Immutability

**Files:**
- Create: `lib/domain/units.ts`
- Create: `lib/domain/pricing.ts`
- Create: `lib/db/repositories/products.ts`
- Create: `lib/db/repositories/markets.ts`
- Create: `lib/db/repositories/product-prices.ts`
- Create: `tests/domain/units.test.ts`
- Create: `tests/domain/pricing.test.ts`
- Create: `tests/repositories/product-prices.test.ts`

**Interfaces:**
- Produces: `convertQuantity`, `assertCompatibleUnits`, `normalizePrice`, `createProductPrice`, `getLatestPrice`, and `listPriceHistory`.

- [ ] Implement unit dimensions for mass, volume, and count.
- [ ] Implement conversions for `g`, `kg`, `ml`, `l`, `tsp`, `tbsp`, and `unit`.
- [ ] Reject cross-dimension conversions with typed domain errors.
- [ ] Normalize prices to `kg`, `l`, or `unit`.
- [ ] Implement price repository create and read methods only.
- [ ] Refuse update and delete paths for price records in code review and tests.
- [ ] Test that two prices for the same product and market create two rows.
- [ ] Test latest price lookup by `observedAt` and id tie-break.

## Phase 4: Prove Recipe Costing Before Recipe UI

**Files:**
- Create: `lib/db/repositories/recipes.ts`
- Create: `lib/domain/recipes.ts`
- Create: `tests/domain/recipes.test.ts`
- Create: `tests/repositories/recipes.test.ts`

**Interfaces:**
- Produces: `calculateRecipeCost(recipeId): Promise<RecipeCostResult>` and repository methods for recipes, ingredients, and manual market selections.

- [ ] Implement `Recipe`, `RecipeProduct`, and `RecipeProductMarket` repository operations.
- [ ] Implement manual pricing with latest compatible price from selected market.
- [ ] Implement cheapest pricing with lowest normalized compatible latest price across markets.
- [ ] Convert ingredient quantities to the chosen price unit before cost calculation.
- [ ] Return per-product breakdown with product, quantity, unit, market, price row, ingredient cost, and missing-price state.
- [ ] Return total cost and cost per serving only when all ingredient costs are complete.
- [ ] Test manual pricing with multiple markets.
- [ ] Test cheapest pricing with normalized price comparison across different package quantities.
- [ ] Test missing price and incompatible unit results.

## Phase 5: Prove Shopping Purchase Transaction And Pantry Ledger

**Files:**
- Create: `lib/db/repositories/shopping-lists.ts`
- Create: `lib/db/repositories/pantry.ts`
- Create: `lib/domain/shopping.ts`
- Create: `lib/domain/pantry.ts`
- Create: `tests/domain/shopping.test.ts`
- Create: `tests/domain/pantry.test.ts`
- Create: `tests/repositories/pantry.test.ts`

**Interfaces:**
- Produces: `markItemBought`, `skipItem`, `duplicateShoppingList`, `buyAgain`, `adjustPantry`, and `cookRecipe`.

- [ ] Implement `ShoppingList`, `ShoppingListItem`, `PantryItem`, and `PantryTransaction` repositories.
- [ ] Implement shopping list statuses `draft`, `active`, `completed`, and `archived`.
- [ ] Implement item statuses `pending`, `bought`, and `skipped`.
- [ ] In `markItemBought`, require actual quantity, actual unit, actual price, and market.
- [ ] In one SQLite transaction, update item status, create a `ProductPrice`, increase pantry, and create a `purchase` transaction.
- [ ] Roll back the whole transaction if any step fails.
- [ ] Implement duplicate and Buy Again by copying planned values and resetting actuals and statuses.
- [ ] Implement manual pantry add, remove, adjustment, and waste with ledger entries.
- [ ] Implement recipe cooking as one full recipe batch with a confirmation-driven service call.
- [ ] Block cooking when pantry is missing required products or compatible quantities.
- [ ] Test successful purchase, rollback, skipped item, duplicate, Buy Again, pantry adjustment, waste, cook success, and cook blocked.

## Phase 6: Prove Local Image Paths And Backup Restore

**Files:**
- Create: `lib/images/paths.ts`
- Create: `lib/images/storage.ts`
- Create: `lib/domain/backup.ts`
- Create: `tests/domain/images.test.ts`
- Create: `tests/domain/backup.test.ts`

**Interfaces:**
- Produces: relative image storage helpers, backup export, backup validation, and staged full restore.

- [ ] Store product images in `images/products/` and recipe images in `images/recipes/`.
- [ ] Reject absolute filesystem paths before database writes.
- [ ] Resolve relative image paths at render time.
- [ ] Export `backup.zip` with `manifest.json`, `database.sqlite`, and `images/`.
- [ ] Include manifest fields `appName`, `backupVersion`, `exportedAt`, `databaseFile`, and `imageDirectory`.
- [ ] Validate archive existence, manifest existence, supported backup version, and database file before import.
- [ ] Stage import files in a temporary directory before replacing current data.
- [ ] Cancel import without data changes when validation fails.
- [ ] Test export structure and full restore replacement.

## Phase 7: Build UI System, Navigation, And Forms On Proven Contracts

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
- Create: `lib/validation/categories.ts`
- Create: `lib/validation/markets.ts`
- Create: `lib/validation/products.ts`
- Create: `lib/validation/product-prices.ts`
- Create: `lib/validation/recipes.ts`
- Create: `lib/validation/shopping.ts`
- Create: `lib/validation/pantry.ts`

**Interfaces:**
- Produces: reusable UI components and React Hook Form + Zod schemas for every feature.

- [ ] Replace template tabs with Products, Markets, Recipes, Shopping, Pantry, and Settings.
- [ ] Build UI components using NativeWind and React Native Reusables.
- [ ] Build form components around React Hook Form.
- [ ] Build Zod schemas with localized validation message keys.
- [ ] Add common empty, loading, error, and destructive-confirmation states.
- [ ] Ensure all labels, buttons, validation messages, and status labels are translation keys.

## Phase 8: Build Catalog, Market, And Product Screens

**Files:**
- Create: `app/(tabs)/products/index.tsx`
- Create: `app/products/new.tsx`
- Create: `app/products/[productId].tsx`
- Create: `app/(tabs)/markets/index.tsx`
- Create: `app/markets/new.tsx`
- Create: `app/markets/[marketId].tsx`
- Create: `components/domain/category-form.tsx`
- Create: `components/domain/market-form.tsx`
- Create: `components/domain/product-form.tsx`
- Create: `components/domain/price-form.tsx`
- Create: `components/domain/price-history-list.tsx`
- Create: `lib/hooks/use-categories.ts`
- Create: `lib/hooks/use-markets.ts`
- Create: `lib/hooks/use-products.ts`
- Create: `lib/hooks/use-product-prices.ts`
- Test: `tests/screens/catalog.test.tsx`

**Interfaces:**
- Consumes: proven product, market, category, price, image, unit, and formatting modules.
- Produces: Products, Product Detail, and Markets PRD screens.

- [ ] Implement category CRUD and uncategorized grouping.
- [ ] Implement product CRUD with images, default unit, rating, notes, favorite flag, and category assignment.
- [ ] Implement market CRUD with name and address.
- [ ] Implement product filters for favorites-only and minimum rating.
- [ ] Implement product sorting by name, highest rated, lowest rated, and favorites first.
- [ ] Implement manual price entry from product detail.
- [ ] Show latest price, price history, and markets where prices exist.
- [ ] Verify destructive delete messages for referenced products, markets, and categories.

## Phase 9: Build Recipe Screens

**Files:**
- Create: `app/(tabs)/recipes/index.tsx`
- Create: `app/recipes/new.tsx`
- Create: `app/recipes/[recipeId].tsx`
- Create: `components/domain/recipe-form.tsx`
- Create: `components/domain/recipe-product-form.tsx`
- Create: `components/domain/recipe-cost-breakdown.tsx`
- Create: `components/domain/recipe-image-field.tsx`
- Create: `lib/hooks/use-recipes.ts`
- Test: `tests/screens/recipes.test.tsx`

**Interfaces:**
- Consumes: proven recipe cost engine, product selectors, price lookup, and image storage.
- Produces: Recipes and Recipe Detail PRD screens.

- [ ] Implement recipe list with calculated cost summary.
- [ ] Implement recipe CRUD with name, description, servings, pricing strategy, image, and product ingredients.
- [ ] Implement manual market selection per recipe product.
- [ ] Implement cheapest-available cost display.
- [ ] Show pricing strategy, total cost, cost per serving, product cost breakdown, and market used for each product.
- [ ] Show incomplete-cost state for missing or incompatible prices.
- [ ] Add Cook Recipe action wired to the proven pantry service.

## Phase 10: Build Shopping And Pantry Screens

**Files:**
- Create: `app/(tabs)/shopping/index.tsx`
- Create: `app/shopping/new.tsx`
- Create: `app/shopping/[shoppingListId].tsx`
- Create: `app/(tabs)/pantry/index.tsx`
- Create: `components/domain/shopping-list-form.tsx`
- Create: `components/domain/shopping-list-item-form.tsx`
- Create: `components/domain/shopping-item-row.tsx`
- Create: `components/domain/pantry-adjustment-form.tsx`
- Create: `components/domain/pantry-transaction-list.tsx`
- Create: `lib/hooks/use-shopping-lists.ts`
- Create: `lib/hooks/use-pantry.ts`
- Test: `tests/screens/shopping.test.tsx`
- Test: `tests/screens/pantry.test.tsx`

**Interfaces:**
- Consumes: proven shopping transaction and pantry ledger services.
- Produces: Shopping Lists and Pantry PRD screens.

- [ ] Implement shopping list create, edit, complete, archive, duplicate, and Buy Again.
- [ ] Implement active, completed, and archived list sections.
- [ ] Implement item pending, bought, and skipped actions.
- [ ] Prioritize favorite products in selectors.
- [ ] Let users edit actual quantity, actual unit, actual price, and market while shopping.
- [ ] Mark bought through the proven transaction service.
- [ ] Show current pantry inventory.
- [ ] Implement manual pantry add, remove, adjustment, and waste actions.
- [ ] Show pantry transaction history.

## Phase 11: Build Settings, I18n Completion, And Backup UI

**Files:**
- Create: `app/(tabs)/settings/index.tsx`
- Create: `components/domain/backup-actions.tsx`
- Create: `lib/i18n/index.ts`
- Create: `lib/i18n/resources/en.ts`
- Create: `lib/i18n/resources/es.ts`
- Create: `lib/formatting/currency.ts`
- Create: `lib/formatting/date.ts`
- Create: `lib/formatting/number.ts`
- Test: `tests/domain/i18n.test.ts`
- Test: `tests/screens/settings.test.tsx`

**Interfaces:**
- Consumes: proven backup service and app config.
- Produces: Settings PRD screen with language switching, export, import, and version display.

- [ ] Detect device language on first launch.
- [ ] Use Spanish when device language is Spanish.
- [ ] Use English when device language is unsupported.
- [ ] Allow manual language switching and persist the choice.
- [ ] Use locale-aware currency, number, and date formatting.
- [ ] Show export and import actions with localized messages.
- [ ] Show explicit import confirmation warning.
- [ ] Show application version from Expo app config.
- [ ] Test that English and Spanish resources have matching keys.

## Phase 12: V1 Hardening And Release Acceptance

**Files:**
- Modify: all feature files with acceptance defects found during verification
- Modify: `lib/i18n/resources/en.ts`
- Modify: `lib/i18n/resources/es.ts`

**Interfaces:**
- Consumes: complete app.
- Produces: V1 release candidate.

- [ ] Audit every visible screen for hardcoded user-facing strings.
- [ ] Verify user content is never translated.
- [ ] Verify all supported units work and invalid cross-dimension conversions are blocked.
- [ ] Verify prices are immutable from manual price entry and shopping purchase flow.
- [ ] Verify product and recipe images store relative paths only.
- [ ] Verify backup export includes database, product images, recipe images, and manifest.
- [ ] Verify backup import fully replaces current data only after confirmation and validation.
- [ ] Run all automated tests.
- [ ] Run typecheck.
- [ ] Manually test the full PRD success criteria on iOS and Android simulators with network disabled.

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
