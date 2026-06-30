# Recipes — Feature Guide

Recipes is the flagship section: a recipe is a named, costed list of product ingredients. Its **cost is derived, never stored** — the latest offer prices for its ingredients drive a live total + per-serving figure. This guide is the map for the whole vertical slice and how to extend it. Read it before touching anything recipe-related.

## Non-Negotiables (recipe-specific)

- **Cost is computed, never persisted.** Recipes read each offer's current price (on its `product_offers` row) per ingredient and run the pure engine in `lib/domain/recipes.ts`. Never add a `cost`/`price` column to `recipes`. Recipes only read offer prices, never write them.
- **Deleting a recipe category never deletes recipes.** `recipes.recipeCategoryId` is `ON DELETE SET NULL` — orphaned recipes fall under "Uncategorized" automatically. Don't reimplement this in app code.
- **Recipe categories are their own entity** (`recipe_categories`), separate from product `categories`. Never reuse the product `Category` for meal-type classification.
- **Never translate user content** — recipe names, descriptions, and category names. All *UI chrome* goes through i18n (`recipes.*`, `recipeCategories.*`); user content does not. Default category names are translated **once at seed time** for the device locale, never again.
- **Images are relative paths** (`images/recipes/{id}.jpg`) via `lib/images/storage.ts`. Never persist picker/filesystem absolute URIs.

## Deliberate v1 scope cuts — do NOT re-add without asking

These were explicit product decisions, not omissions:
- **No category reorder UI.** `recipe_categories.sortOrder` exists only to keep seeded order stable; there is no drag/move UI and no reorder dependency.
- **Single guided form, not a multi-step wizard.** `RecipeForm` is one scrollable screen with numbered `FormSection`s (basic info → ingredients → live cost).
- **Favorites yes, prep/cook time no.** Recipes have `isFavorite`; there is no time field.
- **Ingredients default to cheapest-auto pricing** (`offerId: null`). When a product has 2+ offers the guided form shows a per-ingredient offer picker (`IngredientOfferField`); picking one sets `offerId` and the live cost re-prices against it.

## The vertical slice (where everything lives)

| Layer | Files |
|---|---|
| Schema / migration | `lib/db/schema.ts` (v9), `lib/db/migrations.ts` (`currentVersion < 9` block) |
| Seeds | `lib/db/seeds/recipe-categories-data.ts`, `lib/db/seeds/recipe-categories.ts` |
| Repositories | `lib/db/repositories/recipes.ts`, `lib/db/repositories/recipe-categories.ts` (registered in `repositories/index.ts`) |
| Domain (pure) | `lib/domain/recipes.ts` (cost engine), `lib/domain/pantry.ts` (`consumeRecipeBatch` for Cook) |
| Hooks | `lib/hooks/use-recipes.ts`, `lib/hooks/use-recipe-categories.ts` |
| Validation | `lib/validation/recipes.ts` |
| Components | `components/domain/recipe-{form,card,category-chips,category-form,cost-breakdown,product-form,image-field}.tsx` |
| Screens | `app/(tabs)/recipes/index.tsx`, `app/recipes/new.tsx`, `app/recipes/[recipeId].tsx`, `app/recipe-categories/{index,new,[recipeCategoryId]}.tsx` |
| Routes | registered in `app/_layout.tsx` (`recipes/new`, `recipe-categories/*`) |
| i18n | `recipes.*` + `recipeCategories.*` in `lib/i18n/resources/{en,es}.ts` |
| Tests | `tests/repositories/recipe{s,-categories}.test.ts`, `tests/domain/recipes.test.ts`, `tests/screens/recipe{s,-categories}.test.tsx` |
| Design | `design/recipes.pen` (screens), `design/components/components.pen` (shared component library) |

## Data model (schema v9)

```sql
recipe_categories(id, name, emoji, description, sortOrder, createdAt, updatedAt)
recipes(id, name, description, servings, recipeCategoryId →recipe_categories ON DELETE SET NULL,
        isFavorite INTEGER, imagePath, createdAt, updatedAt)
recipe_products(id, recipeId →recipes CASCADE, productId →products CASCADE,
                offerId →product_offers SET NULL, quantity, unit, ...)   -- one ingredient
```

- Recipe categories get a **dedicated `emoji` column** (product categories overload `description` for the emoji — recipe categories do not; `description` here is real descriptive text).
- **`servings` is optional.** The column stays `REAL NOT NULL`, but `0` is the "unset" sentinel — a blank servings field saves `0`, and the UI hides the servings meta line and the per-serving cost when `servings <= 0` (the cost engine already returns `costPerServing: null` for `servings <= 0`). Storing `0` avoids a destructive nullable-column rebuild. `recipeSchema.servings` maps blank input → `undefined`; the screens map `?? 0` on save.
- `recipe_products.offerId` null = cost against the **cheapest current offer**; set = cost against that specific offer.
- The v9 migration is **additive** (no destructive rebuild): `CREATE TABLE IF NOT EXISTS` + `addColumnIfMissing` + `seedDefaultRecipeCategories(db)`. Seeding happens inside the `< 9` block (not in `runSeeds`) so defaults land once for both fresh installs and existing dev DBs.

## Repositories

`createRecipeRepository(db)` (`recipes.ts`):
- Base CRUD with a `mapRecipe` row mapper (`isFavorite` int↔bool, same pattern as products).
- `create(input)` accepts an optional `input.id` — the create flow pre-generates the id so an image can be saved to `images/recipes/{id}.jpg` before the row exists.
- `listIngredients(recipeId)`, `addIngredient(input)`, `removeIngredient(id)`.
- **`setIngredients(recipeId, inputs[])`** — replaces the full ingredient list in one transaction (delete + re-insert). The edit flow uses this rather than diffing.

`createRecipeCategoryRepository(db)` (`recipe-categories.ts`):
- `list()` orders by `sortOrder ASC, createdAt ASC` (seeded order).
- `create()` assigns `sortOrder = max+1` (append). `getById`/`update`/`delete` from base.

## Domain — the cost engine (`lib/domain/recipes.ts`)

Pure and unit-tested; this is the heart of the feature.
- `calculateRecipeCost({ servings, ingredients, prices })` → `RecipeCostResult` `{ complete, totalCost, costPerServing, breakdown, missingProductIds }`.
- Pricing rule (`pickPrice`): use the ingredient's chosen offer when it has a unit-compatible price, else the **cheapest unit-compatible** offer for that product.
- If **any** ingredient lacks a compatible price → `complete: false` and `totalCost`/`costPerServing` are `null` (no partial totals leak out).
- `calculateRecipeCosts(recipes[], prices)` → `{ [recipeId]: RecipeCostResult }`, the batch wrapper the listing uses. `prices` is the latest price of every offer, built once upstream (`O(recipes × ingredients × prices)` — fine at local scale).
- Keep this layer free of React/DB. Cost changes go here + a test in `tests/domain/recipes.test.ts`.

## Hooks (`lib/hooks/use-recipes.ts`, `use-recipe-categories.ts`)

- `useRecipes()` — collection CRUD over recipes + `createWithIngredients(input, ingredients[])` (creates recipe then `setIngredients`). Returns plain `Recipe[]` in `items`.
- `useRecipeOverviews()` — the **listing** source. Loads recipes, products, product categories, and all offers once; returns `RecipeOverview[]` = recipe + `{ totalCost, costPerServing, complete, ingredientCount, ingredientEmojis[] }`. Ingredient emoji = each ingredient's product-category emoji via `productEmoji` (`lib/ui/category-emoji.ts`). Also exposes `toggleFavorite(id, value)`.
- `useRecipeDetail(recipeId)` — `{ recipe, ingredients, save(input, ingredients?), toggleFavorite(), calculateCost(), cook(), remove(), addIngredient(), reload() }`. `calculateCost()` loads offers per ingredient and runs the engine; `cook()` consumes one batch from the pantry via `consumeRecipeBatch`.
- `useRecipeCategories()` — `useCollection` wrapper over the recipe-category repo.

## Components

- **`RecipeForm`** (`recipe-form.tsx`) — the guided create/edit form. Three `FormSection`s: basic info (name, optional servings, category via `CreatableSelect` with inline `RecipeCategoryForm`, description, image), ingredients (`useFieldArray`), and a live `calculateRecipeCost` summary. Requires a `recipeId` prop (create screen pre-generates one). Takes `initialValues` for edit. Renders its **own end-of-form Save button** — screens mount it without `hideSubmit` so the long form has a save action at the bottom as well as in the header.
  - **Ingredient row UX**: the product picker is a **searchable** `SelectInput` (name filter + drag-to-resize sheet) whose options carry the product's image (`bestImagePath`) or category emoji (`productEmoji`). Selecting a product **carries over its `defaultUnit`** and resets the chosen offer via `form.setValue`. The unit control is a compact `SelectInput` dropdown — **not** the pill `Select`.
  - **Per-ingredient offer picker** (`IngredientOfferField`, bottom of `recipe-form.tsx`): a child component so it can call `useProductOffers(productId)` per row. It renders only when the product has 2+ offers; options are "Cheapest (auto)" (`''` → `null`) plus each offer labeled market·brand·size·price. Selecting one stores `offerId`, which both the live preview and the saved ingredient cost against (the engine's `pickPrice` honors it).
  - **Live cost** reads `useWatch({ control, name: 'ingredients' })` (not `form.watch`) so the total/per-serving re-render on every quantity keystroke inside a `useFieldArray` row.
- **`RecipeCard`** (`recipe-card.tsx`) — listing card: image/emoji, name + favorite star, category·servings meta, ingredient-emoji strip (`+N` overflow), total + per-serving price, chevron.
- **`RecipeCategoryChips`** (`recipe-category-chips.tsx`) — horizontal single-select filter chips (All / ⭐Favorites / categories) with counts. Each chip has `accessibilityRole="button"` + label (press by label in tests).
- **`RecipeCategoryForm`** (`recipe-category-form.tsx`) — emoji (`EmojiPicker`) + name + description, mirrors `category-form.tsx`.
- **`RecipeCostBreakdown`** (`recipe-cost-breakdown.tsx`) — total + per-serving + per-line costs; shows product names, not IDs.
- **`RecipeProductForm`** (`recipe-product-form.tsx`) — single-ingredient editor with **offer selection** (specific offer vs "cheapest auto"). Not currently mounted in the guided form; reach for it when adding a detail-screen "edit ingredient / pick offer" affordance.

## Screens

- `app/(tabs)/recipes/index.tsx` — listing: search + chips + sort sheet + cards + "automatically priced" banner (→ manage categories). Uses the shared catalog listing "+ New" pattern (`ListingScreenHeader`, optional `ListNewItem`, search-empty `EmptyState` action).
- `app/recipes/new.tsx` — pre-generates the recipe id, renders `RecipeForm`, calls `createWithIngredients`.
- `app/recipes/[recipeId].tsx` — view mode (category chip, favorite toggle, cost breakdown, ingredients, Cook) ↔ inline edit mode (`RecipeForm` prefilled, `save`, delete).
- `app/recipe-categories/{index,new,[recipeCategoryId]}.tsx` — management: list with recipe counts + Uncategorized, create, edit/delete.

## How to expand

**Add a field to a recipe** (e.g. instructions): add the column to `SCHEMA_SQL` + a new `currentVersion < N` migration block (`addColumnIfMissing`, bump `LATEST_SCHEMA_VERSION`) → extend `Recipe`/`RecipeInput` + `create()`/`mapRecipe` in `recipes.ts` → add to `recipeSchema` → add the field to `RecipeForm` → render on card/detail → add `recipes.*` keys to **both** en + es (parity test enforces it) → cover with a repo/screen test.

**Add a recipe-category capability** (e.g. reorder — currently deferred): add a `reorder(orderedIds)` method to `recipe-categories.ts` (update `sortOrder`), expose it through `useRecipeCategories`, and build the UI on `recipe-categories/index.tsx`. Confirm with the product owner first — reorder was intentionally cut.

**Change cost behavior**: edit `calculateRecipeCost`/`pickPrice` in `lib/domain/recipes.ts` and add a case to `tests/domain/recipes.test.ts`. Don't push pricing logic into hooks or screens.

**Add a per-row control that needs its own data** (e.g. the existing offer picker): make it a child component so it can call a hook per row — `IngredientOfferField` is the reference (it calls `useProductOffers(productId)` and renders inside a `Controller` for `ingredients.${index}.<field>`). Don't try to call the hook inside the `.map` callback.

**Add a recipe sub-flow / route**: create the screen under `app/recipes/` or `app/recipe-categories/` and register it in `app/_layout.tsx` (`headerShown: false`).

## Verification

For any change, add/adjust a focused test first, then run `npm test` and `npm run typecheck -- --pretty false` before claiming done (per the root `AGENTS.md`). i18n changes must keep en/es key parity (`tests/domain/i18n.test.ts`).
