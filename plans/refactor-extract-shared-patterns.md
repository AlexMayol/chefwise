# Refactor: extract repeated patterns

## Context

A duplication scan of the codebase surfaced repeated hook/CRUD/form/screen patterns. This plan covers all 9 candidates, ordered so the lowest-risk, highest-leverage extractions land first and later items build on them. Each item is independently shippable — do them as separate commits/PRs, run `npm test` + `npm run typecheck -- --pretty false` after each.

Guiding rule (ponytail): extract only what's duplicated **today**. Don't add config/props for variations that don't exist yet. Existing shared code to reuse, not re-invent: `lib/db/repositories/base.ts` (`createCrudRepository`, `insertRow`, `updateRow`, `toSqlBoolean`/`fromSqlBoolean`, `createId`, `nowIso`), `lib/validation/common.ts` (already centralized — leave alone), `components/domain/delete-button.tsx`, `components/ui/card.tsx`, `components/ui/form-field.tsx`.

---

## 1. Generic `useCollection` hook — HIGH (~150 LOC)

**Problem:** `lib/hooks/use-markets.ts` and `use-categories.ts` are byte-for-byte identical (`items/loading/reload/create/update/remove` over a repo). `use-products.ts:9-62`, `use-recipes.ts:9-42`, `use-shopping-lists.ts:10-52`, `use-product-prices.ts` repeat the same `reload`/`create` skeleton with extra methods bolted on.

**Extract:** `lib/hooks/use-collection.ts`
```ts
export function useCollection<T, Input>(repo: {
  list(): Promise<T[]>;
  create(input: Input): Promise<T>;
  update(id: string, input: Partial<Input>): Promise<void>;
  delete(id: string): Promise<void>;
}) {
  // items/loading state, reload (setLoading try/finally), create/update/remove that reload()
  // returns { items, loading, reload, create, update, remove }
}
```

**Apply:**
- `use-markets.ts`, `use-categories.ts` → become `useCollection(repositories.markets)` one-liners (keep the named exports + return shape so call sites don't change).
- `use-products.ts` `useProducts`: reuse `useCollection` for state/reload/update/remove, keep the bespoke `create` (it also writes an initial price) and the `options`-driven `list`. May need `useCollection` to accept a `list: () => Promise<T[]>` thunk so the `options` closure works — add that param only if needed.
- `use-recipes.ts`/`use-shopping-lists.ts` list hooks: reuse for the list/reload/create core; keep `addIngredient`/`addItem`/`duplicateAsDraft` as extra members layered on top.

**Watch:** the `reload` dependency arrays differ (products keys on `options.*`). Don't regress the memoization. `use-product-prices.ts` is the conditional/create-only variant — covered by #2, not here.

**Verify:** existing hook behavior is covered by `tests/screens/*` and `tests/repositories/*`. No new tests needed if return shapes are preserved.

---

## 2. Generic `useDetail` hook — HIGH (~80 LOC)

**Problem:** the "if no id → reset+return, else getById" skeleton repeats ~95% across `useProductDetail` (use-products.ts:64-110), `useRecipeDetail` (use-recipes.ts:44-127), `useShoppingListDetail` (use-shopping-lists.ts:54-140), and `useProductPrices` (use-product-prices.ts:6-42).

**Extract:** `lib/hooks/use-detail.ts`
```ts
export function useDetail<T>(id: string | undefined, load: (id: string) => Promise<T>, empty: T) {
  // item=empty, loading=Boolean(id); reload short-circuits when !id; returns { item, loading, reload }
}
```
Use a `load` thunk + `empty` value so it serves both single-entity (`empty: null`) and list-shaped (`empty: []`) details.

**Apply:** rebuild the reload/loading core of all four detail hooks on `useDetail`, then keep their domain methods (`update`/`remove`/`addIngredient`/`cost`/`cook`/`markBought`/`markSkipped`) as-is on top. `useRecipeDetail` loads two things (recipe + ingredients) — either call `useDetail` twice or have `load` return a tuple; pick whichever reads cleaner.

**Verify:** `tests/screens/product-selectors.test.tsx`, `market-detail`, `category-detail`, `recipes` cover these paths.

---

## 3. `ControlledInput` wrapper — HIGH (~70 LOC, 19 sites)

**Problem:** every text field repeats `Controller` + `FormField` + `Input` + `fieldState.error?.message ? t(fieldState.error.message) : undefined`. ~19 occurrences across product/market/category/recipe/shopping/price/pantry forms.

**Extract:** `components/ui/controlled-input.tsx`
```tsx
// wraps Controller<TFieldValues> + FormField + Input; translates the error key internally
<ControlledInput control={form.control} name="name" label={t('forms.name')} placeholder={...} />
```
Pass through the `Input` props actually used today: `placeholder`, `keyboardType`, `multiline`, `affix`, `className`. Do the `t(error.message)` translation inside (every site does it identically). Numeric fields currently do `value === undefined ? '' : String(value)` and `onChangeText` straight to `field.onChange` — keep that behavior; don't add number parsing the call sites don't have.

**Apply:** replace the simple text/number fields first (name, address, price, quantity, servings, etc.). Leave non-`Input` controllers (`UnitInput`, `RatingInput`, `CreatableSelect`, emoji grid) alone — they're not the duplicated shape.

**Verify:** add one focused `tests/` render asserting label + error translation render; otherwise existing form/screen tests cover it.

---

## 4. `ScreenScaffold` + keep detail screens separate — HIGH/MEDIUM (~40 LOC)

**Problem:** the `<ScrollView className="flex-1 bg-background" contentContainerStyle={{ gap:16, paddingTop: insets.top+16, paddingBottom: 16, paddingHorizontal: 20 }}>` shell is copy-pasted 5× (`app/markets/[marketId].tsx`, `app/categories/[categoryId].tsx`, `feature-screen.tsx`, `collection-screen.tsx` ×2). The two detail screens are also ~90% structurally identical (header + ProductGrid + Edit-in-BottomSheet).

**Extract (do):** `components/ui/screen-scaffold.tsx` — the ScrollView + safe-area shell. Single `paddingBottom` variation (16 vs 32 for modal) → optional prop. Adopt in the 5 sites.

**Do NOT (yet):** a generic `EntityDetailScreen<T>`. The two detail screens look identical but tend to diverge (they already differ: market shows `address` + `showMarket={false}` grid + `marketId` nav param; category shows `description` emoji + `categoryId` param). Extracting now bakes in a wrong abstraction. Revisit only when a 3rd detail screen appears. `// ponytail:` note this decision in the scaffold file.

**Verify:** `tests/screens/market-detail.test.tsx`, `category-detail.test.tsx`, `catalog`, `categories`.

---

## 5. Products/pantry repos adopt `createCrudRepository` — MEDIUM (~40 LOC)

**Problem:** `lib/db/repositories/products.ts:52-133` reimplements get/create/update/delete inline (only `list` is genuinely custom — the price join). `createCrudRepository` (base.ts:90) already exists and is used by categories/markets.

**Extract:** extend `createCrudRepository` with an optional `mapper?: (row: Raw) => T` and let `create`/`update` accept a `toRow` transform (for the `isFavorite` boolean conversion). Keep the signature backward-compatible (categories/markets pass nothing).

**Apply:** `createProductRepository` keeps its custom `list`, delegates `getById`/`create`/`update`/`delete` to the base with `mapProduct` + the favorite-bool transform. Check `lib/db/repositories/pantry.ts` for the same opportunity (scan flagged it as custom).

**Verify:** `tests/repositories/products.test.ts`, `product-prices.test.ts`, `base.test.ts`, `migrations.test.ts`. (Note: those test files currently have a pre-existing `serializeAsync` typecheck gap in their DB mocks — unrelated, but fix or confirm before relying on typecheck here.)

---

## 6. Use `DeleteButton` / `FormActions` consistently — MEDIUM (3-4 sites)

**Problem:** `market-form.tsx:22-33,70-74` hand-rolls delete + error state; `category-form.tsx:87-90` calls `onDelete` directly with no error handling — inconsistent. The `<View className="flex-row gap-3">` Save/Delete pair repeats in both plus `shopping-purchase-form.tsx`.

**Apply:**
- Replace the bespoke delete handling in `market-form.tsx` with the existing `components/domain/delete-button.tsx` (already does try/catch → `errors.deleteBlocked` + `router.back()`). Same for `category-form.tsx` (gains the missing error handling for free).
- Optionally extract `components/ui/form-actions.tsx` for the `flex-row gap-3` primary+secondary button row if it still reads as duplication after the DeleteButton swap. Skip if it doesn't earn its keep.

**Watch:** `DeleteButton` calls `router.back()` itself — confirm that matches each form's current post-delete flow (the BottomSheet detail screens expect to pop). Adjust if a form needs to stay put.

**Verify:** `market-detail`, `category-detail` screen tests.

---

## 7. `MarketSelect` / `CategorySelect` domain wrappers — MEDIUM (2 sites)

**Problem:** `product-form.tsx:72-94` and `124-151` each carry the full `CreatableSelect` + options-map + `renderCreateForm` (create→`onCreated(id)`) boilerplate.

**Extract:** `components/domain/market-select.tsx` and `category-select.tsx`, each `{ value, onChange }` and owning the options mapping + inline create form internally (pull `useMarkets`/`useCategories` create in there).

**Apply:** product-form's two fields collapse to `<MarketSelect value={field.value} onChange={field.onChange} />` / `<CategorySelect ... />`. These wrappers are then reusable anywhere a market/category picker is needed.

**Watch:** CategorySelect must preserve the `uncategorized` ↔ `null` mapping currently in product-form:130-131.

**Verify:** `tests/screens/product-selectors.test.tsx` (directly covers these selectors).

---

## 8. `useCreateAndNavigateBack` — MEDIUM/LOW (4 sites)

**Problem:** `async (values) => { await create(values); router.back(); }` repeats in `app/products/new.tsx`, `markets/new.tsx`, `recipes/new.tsx`, `shopping/new.tsx`.

**Extract:** small hook `lib/hooks/use-create-and-back.ts` returning the wrapped submit handler. Keep it trivial — it's `useRouter` + the create thunk.

**Watch:** `products/new.tsx` now passes `initialPrice` as a 2nd arg and reads `initialValues` from search params — the hook must forward all submit args (`(...args) => { await create(...args); router.back(); }`), not assume a single `values`.

**Verify:** `tests/screens/catalog`, `recipes`, plus manual create→back on each screen.

---

## 9. `IconButton` primitive — LOW (2-3 sites)

**Problem:** `size-N items-center justify-center rounded-full <bg> active:opacity-70` appears in `back-button.tsx:17`, `entity-image-field.tsx` close button (~:58). (`select.tsx` pill is a different shape — not this.)

**Extract:** `components/ui/icon-button.tsx` — a circular Pressable taking `size`, a bg variant (`muted`/`background`), `onPress`, `accessibilityLabel`, children. `back-button.tsx` becomes a thin consumer.

**Lowest priority** — back-button is already extracted, so this only de-dupes one more site. Do it last or skip if it doesn't feel worth it.

**Verify:** `tests/screens/market-detail`, `category-detail`, `feature-screen` render the back button.

---

## Explicitly NOT doing

- **`useForm` setup / save-button one-liner** — inherent React Hook Form shape, not duplication.
- **Unit+quantity field pairs** — surface-similar, semantically different per form (price vs unit vs stock); merging adds variance-handling that costs more than it saves.
- **SQL "latest/list" query abstraction** — domain-specific orderings; indirection without clarity.
- **Validation schemas** — already centralized in `lib/validation/common.ts`.
- **Boolean SQL mappers** — already in `base.ts`.

## Recommended order

3 → 1 → 2 (hooks + forms, biggest wins, well-tested) → 5 (repo base) → 7 → 6 → 4 (scaffold only) → 8 → 9. Each is its own commit with green `npm test` + typecheck before the next.
