# Vertical-Slices V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Grocery Cost Tracker V1 by delivering one end-to-end user workflow at a time.

**Architecture:** Each slice includes the minimum database, domain service, validation, UI, i18n, and tests needed for that workflow to work on device. Shared infrastructure starts thin and is expanded only when a slice needs it, while the final app still converges on the same SQLite-backed offline architecture.

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

## Shared Defaults Used In Every Slice

- Normalize mass prices to `kg`, volume prices to `l`, and count prices to `unit`.
- Use `1 tsp = 5 ml`, `1 tbsp = 15 ml`, `1 l = 1000 ml`, and `1 kg = 1000 g`.
- Treat missing recipe prices as incomplete costs with localized UI, never as zero-cost ingredients.
- Use one pantry row per product and merge compatible quantities into the product default unit.
- Use a full-replace backup import with explicit confirmation and no merge behavior.
- Reset actual quantities, actual prices, markets, product price references, and item statuses when duplicating or buying again from a shopping list.

## Target End State

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
  domain/
  hooks/
  i18n/
  images/
  validation/
  formatting/
tests/
  domain/
  repositories/
  screens/
```

## Slice 0: App Shell, Tooling, And Local Infrastructure

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `app/_layout.tsx`
- Modify: `app/(tabs)/_layout.tsx`
- Create: `babel.config.js`
- Create: `tailwind.config.js`
- Create: `global.css`
- Create: `lib/db/client.ts`
- Create: `lib/db/migrations.ts`
- Create: `lib/i18n/index.ts`
- Create: `lib/i18n/resources/en.ts`
- Create: `lib/i18n/resources/es.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/dialog.tsx`
- Create: `components/ui/empty-state.tsx`
- Create: `tests/setup.ts`

**Interfaces:**
- Produces: app providers, tabs, NativeWind setup, i18n setup, SQLite connection, migration runner, and test commands.

- [ ] Add stack dependencies for SQLite, Expo File System, React Hook Form, Zod, NativeWind, React Native Reusables, i18next, and react-i18next.
- [ ] Configure NativeWind for Expo SDK 56 and keep Expo Router typed routes enabled.
- [ ] Replace template tabs with Products, Markets, Recipes, Shopping, Pantry, and Settings.
- [ ] Initialize SQLite during app startup before domain screens render.
- [ ] Initialize i18next with English and Spanish resources.
- [ ] Add core UI components that accept translated labels and messages.
- [ ] Add `npm test` and `npm run typecheck` scripts.
- [ ] Verify the shell starts on iOS and Android with empty localized tabs.

## Slice 1: Catalog Setup Workflow

**User outcome:** A user can create categories, markets, and products, then browse and edit a categorized catalog entirely offline.

**Files:**
- Create: `lib/db/schema.ts`
- Create: `lib/db/repositories/categories.ts`
- Create: `lib/db/repositories/markets.ts`
- Create: `lib/db/repositories/products.ts`
- Create: `lib/domain/units.ts`
- Create: `lib/validation/categories.ts`
- Create: `lib/validation/markets.ts`
- Create: `lib/validation/products.ts`
- Create: `lib/hooks/use-categories.ts`
- Create: `lib/hooks/use-markets.ts`
- Create: `lib/hooks/use-products.ts`
- Create: `components/domain/category-form.tsx`
- Create: `components/domain/market-form.tsx`
- Create: `components/domain/product-form.tsx`
- Create: `components/domain/rating-input.tsx`
- Create: `components/domain/unit-input.tsx`
- Create: `app/(tabs)/products/index.tsx`
- Create: `app/products/new.tsx`
- Create: `app/products/[productId].tsx`
- Create: `app/(tabs)/markets/index.tsx`
- Create: `app/markets/new.tsx`
- Create: `app/markets/[marketId].tsx`
- Test: `tests/screens/catalog.test.tsx`

**Interfaces:**
- Produces: category, market, and product repositories; product selectors used by later recipe and shopping slices.

- [ ] Add SQLite tables for `Category`, `Market`, and `Product`.
- [ ] Implement Zod schemas for category, market, and product forms.
- [ ] Implement unit selection for `g`, `kg`, `ml`, `l`, `tsp`, `tbsp`, and `unit`.
- [ ] Implement category CRUD and display uncategorized products under localized `Uncategorized`.
- [ ] Implement market CRUD with name and address.
- [ ] Implement product CRUD with name, optional category, default unit, rating 1-5, notes, and favorite flag.
- [ ] Implement catalog filters for favorites-only and minimum rating.
- [ ] Implement catalog sorting by name, highest rated, lowest rated, and favorites first.
- [ ] Block deletes for records that later slices make referenced, and show localized messages.
- [ ] Verify product names, notes, category names, and market names are not translated.

## Slice 2: Product Images And Local File Storage

**User outcome:** A user can attach local images to products and the app stores only relative paths.

**Files:**
- Create: `lib/images/paths.ts`
- Create: `lib/images/storage.ts`
- Modify: `components/domain/product-form.tsx`
- Modify: `app/products/[productId].tsx`
- Test: `tests/domain/images.test.ts`

**Interfaces:**
- Produces: `saveEntityImage`, `deleteEntityImage`, and `resolveImageUri` for products now and recipes later.

- [ ] Use Expo File System for app-owned image storage.
- [ ] Store product images under `images/products/`.
- [ ] Persist only relative image paths in `Product.imageUri`.
- [ ] Resolve relative paths to renderable URIs at display time.
- [ ] Reject absolute file paths before database writes.
- [ ] Delete product images only when the product can be deleted and no dependent records block deletion.

## Slice 3: Price Capture And History Workflow

**User outcome:** A user can add immutable product prices, see latest price, see price history, and see markets where prices exist.

**Files:**
- Create: `lib/db/repositories/product-prices.ts`
- Create: `lib/domain/pricing.ts`
- Create: `lib/formatting/currency.ts`
- Create: `lib/formatting/date.ts`
- Create: `lib/formatting/number.ts`
- Create: `lib/validation/product-prices.ts`
- Create: `lib/hooks/use-product-prices.ts`
- Create: `components/domain/price-form.tsx`
- Create: `components/domain/price-history-list.tsx`
- Modify: `app/products/[productId].tsx`
- Test: `tests/domain/units.test.ts`
- Test: `tests/domain/pricing.test.ts`
- Test: `tests/domain/product-prices.test.ts`

**Interfaces:**
- Produces: immutable price creation and normalized price lookup used by recipes and shopping.

- [ ] Add `ProductPrice` table and indexes for product, market, and observed date.
- [ ] Implement conversion and compatibility checks for all supported units.
- [ ] Normalize prices to price per `kg`, `l`, or `unit`.
- [ ] Implement price form with product, market, price, quantity, unit, and observed date.
- [ ] Append new price rows only; do not expose update or delete operations.
- [ ] Show latest price by newest `observedAt` and price history sorted newest first.
- [ ] Show distinct markets that have prices for the product.
- [ ] Test immutable append behavior and normalized comparisons.

## Slice 4: Recipe Costing Workflow

**User outcome:** A user can create recipes, add products, choose manual or cheapest pricing, and see total cost, cost per serving, and market breakdown.

**Files:**
- Create: `lib/db/repositories/recipes.ts`
- Create: `lib/domain/recipes.ts`
- Create: `lib/validation/recipes.ts`
- Create: `lib/hooks/use-recipes.ts`
- Create: `components/domain/recipe-form.tsx`
- Create: `components/domain/recipe-product-form.tsx`
- Create: `components/domain/recipe-cost-breakdown.tsx`
- Create: `components/domain/recipe-image-field.tsx`
- Create: `app/(tabs)/recipes/index.tsx`
- Create: `app/recipes/new.tsx`
- Create: `app/recipes/[recipeId].tsx`
- Modify: `lib/images/storage.ts`
- Test: `tests/domain/recipes.test.ts`
- Test: `tests/screens/recipes.test.tsx`

**Interfaces:**
- Produces: recipe CRUD, recipe ingredients, manual market selections, cheapest available selections, and recipe image storage.

- [ ] Add `Recipe`, `RecipeProduct`, and `RecipeProductMarket` tables.
- [ ] Store recipe images under `images/recipes/` with relative paths only.
- [ ] Implement recipe CRUD with name, description, servings, pricing strategy, image, and products.
- [ ] For manual pricing, require a market for each recipe product and use that market's latest compatible price.
- [ ] For cheapest pricing, choose the lowest normalized compatible latest price across all markets.
- [ ] Convert ingredient quantities before calculating ingredient cost.
- [ ] Display incomplete-cost state when prices are missing or units are incompatible.
- [ ] Display pricing strategy, total cost, cost per serving, product breakdown, and market used.
- [ ] Test manual pricing, cheapest pricing, missing prices, and cost per serving.

## Slice 5: Shopping List Workflow

**User outcome:** A user can create reusable shopping lists, mark items bought or skipped, update prices while shopping, and complete lists.

**Files:**
- Create: `lib/db/repositories/shopping-lists.ts`
- Create: `lib/domain/shopping.ts`
- Create: `lib/validation/shopping.ts`
- Create: `lib/hooks/use-shopping-lists.ts`
- Create: `components/domain/shopping-list-form.tsx`
- Create: `components/domain/shopping-list-item-form.tsx`
- Create: `components/domain/shopping-item-row.tsx`
- Create: `app/(tabs)/shopping/index.tsx`
- Create: `app/shopping/new.tsx`
- Create: `app/shopping/[shoppingListId].tsx`
- Test: `tests/domain/shopping.test.ts`
- Test: `tests/screens/shopping.test.tsx`

**Interfaces:**
- Produces: reusable shopping lists and bought-item transactions that create prices and pantry updates in later slice integration.

- [ ] Add `ShoppingList` and `ShoppingListItem` tables with PRD statuses.
- [ ] Implement list create, edit, complete, archive, duplicate, and Buy Again.
- [ ] Implement item create, edit, pending, bought, and skipped states.
- [ ] Prioritize favorite products in item product selectors.
- [ ] Require actual quantity, actual unit, actual price, and market before marking an item bought.
- [ ] Create an immutable `ProductPrice` when marking an item bought.
- [ ] Keep the pantry update integration behind a `recordPurchaseInPantry` function that Slice 6 implements.
- [ ] Complete a list when all items are bought or skipped.
- [ ] Test duplicate and Buy Again reset actual values and statuses.

## Slice 6: Pantry And Purchase Integration Workflow

**User outcome:** A user can maintain pantry inventory manually, purchases increase pantry inventory, and cooking recipes decreases pantry inventory.

**Files:**
- Create: `lib/db/repositories/pantry.ts`
- Create: `lib/domain/pantry.ts`
- Create: `lib/validation/pantry.ts`
- Create: `lib/hooks/use-pantry.ts`
- Create: `components/domain/pantry-adjustment-form.tsx`
- Create: `components/domain/pantry-transaction-list.tsx`
- Create: `app/(tabs)/pantry/index.tsx`
- Modify: `lib/domain/shopping.ts`
- Modify: `app/recipes/[recipeId].tsx`
- Test: `tests/domain/pantry.test.ts`
- Test: `tests/screens/pantry.test.tsx`

**Interfaces:**
- Produces: pantry inventory, transaction log, purchase integration, and recipe cook integration.

- [ ] Add `PantryItem` and `PantryTransaction` tables.
- [ ] Implement manual add, remove, adjustment, and waste actions.
- [ ] Record every change as a `purchase`, `consume`, `adjustment`, or `waste` transaction.
- [ ] Implement `recordPurchaseInPantry` and call it inside the shopping bought transaction.
- [ ] Merge purchase quantities into a single pantry item per product using compatible unit conversion.
- [ ] Add Cook Recipe on recipe detail with confirmation.
- [ ] Consume one full recipe batch when cooking and create `consume` transactions.
- [ ] Block cooking if pantry quantities are missing or incompatible.
- [ ] Test shopping purchase increases pantry and recipe cooking decreases pantry.

## Slice 7: Settings, Language Switching, And Backup Workflow

**User outcome:** A user can switch language, export a full backup, import a full backup after confirmation, and see the app version.

**Files:**
- Create: `lib/domain/backup.ts`
- Create: `components/domain/backup-actions.tsx`
- Modify: `app/(tabs)/settings/index.tsx`
- Modify: `lib/i18n/index.ts`
- Modify: `lib/i18n/resources/en.ts`
- Modify: `lib/i18n/resources/es.ts`
- Test: `tests/domain/backup.test.ts`
- Test: `tests/domain/i18n.test.ts`
- Test: `tests/screens/settings.test.tsx`

**Interfaces:**
- Produces: language selector, app version display, full export, full import, and backup validation.

- [ ] Detect device language on first launch and default unsupported languages to English.
- [ ] Persist manual language switching.
- [ ] Add all remaining English and Spanish translation keys.
- [ ] Export `backup.zip` with `manifest.json`, `database.sqlite`, `images/products`, and `images/recipes`.
- [ ] Include manifest fields `appName`, `backupVersion`, `exportedAt`, `databaseFile`, and `imageDirectory`.
- [ ] Validate archive existence, manifest existence, supported backup version, and database file before import.
- [ ] Show explicit localized confirmation before replacing current data.
- [ ] Stage import data and replace current data only after validation succeeds.
- [ ] Show app version from Expo app config.

## Slice 8: Cross-Slice Hardening And V1 Acceptance

**Files:**
- Modify: `lib/i18n/resources/en.ts`
- Modify: `lib/i18n/resources/es.ts`
- Modify: all files with user-facing strings discovered during audit
- Modify: all feature screens with accessibility or navigation issues discovered during manual verification

**Interfaces:**
- Consumes: all prior slices.
- Produces: V1-ready app that satisfies every PRD success criterion.

- [ ] Audit for hardcoded user-facing strings and move them into i18n resources.
- [ ] Verify user content is never translated.
- [ ] Verify all form validation messages are localized.
- [ ] Verify invalid cross-dimension conversions are blocked in prices, recipes, shopping, and pantry.
- [ ] Verify no absolute image paths are stored in SQLite.
- [ ] Verify price history remains immutable after shopping and manual price entry.
- [ ] Run automated tests for domain services, repositories, and screens.
- [ ] Manually test the full happy path: create catalog, add prices, cost recipe, shop, update pantry, cook recipe, export backup, import backup, switch language.
- [ ] Manually test offline startup and usage on iOS and Android.

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
