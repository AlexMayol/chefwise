# App Routes

## Screen Responsibilities

- Expo Router files **compose only**: call hooks, pass results into shared UI/domain components, and render screen-specific chrome (search, filters, sheets). Keep route files slim — no duplicated loading/empty/list branches, no inlined visibility rules that belong in `lib/ui/` or shared components.
- Keep business rules in `lib/domain/` and persistence in repositories.
- Bottom tab screens use in-page titles via `CollectionScreen` or `FeatureScreen`; keep the global native tab header hidden.
- Detail routes such as `products/[productId].tsx`, `recipes/[recipeId].tsx`, and `shopping/[shoppingListId].tsx` load data through hooks and should avoid direct database access.
- Modal-style create/edit flows use the full-screen `CollectionScreen` form state. The collection screen closes transient form state on route blur.

When adding or changing a screen, extract shared pieces instead of copying from a sibling route. **Catalog listings** are the template: pure visibility in `lib/ui/listing-create-actions.ts`, body layout in `ListingContent`, header in `ListingScreenHeader`; the screen file wires hooks, filter state, and list `children` only.

## Navigation

- Register every new stack route in `app/_layout.tsx`; the root stack is not inferred for these explicit screens.
- Tab definitions live in `lib/navigation/tabs.ts`; update that file and translations together when changing tabs.
- Use typed `Href` casts for dynamic links where Expo Router cannot infer string literals.
- Keep mobile as the V1 target. Web compatibility is useful, but do not choose web-only patterns over mobile behavior.
- There are two create patterns today: tab grids use inline `CollectionScreen` forms, while `/new` stack routes exist and call `router.back()`. Prefer the inline pattern for tab list actions unless deliberately standardizing the app.
- Known gap: `markets/[marketId].tsx` does not currently load the market by id for editing; do not copy that pattern into new detail screens.

## Listing Screens

Catalog tab listings (recipes, products, markets, categories) share a three-tier "+ New" create pattern. **Do not reimplement this in route files** — use the shared stack:

| Layer | Location | Role |
|-------|----------|------|
| Visibility rules | `lib/ui/listing-create-actions.ts` | `getListingCreateVisibility`, `shouldShowListFooterNew`, etc. |
| Body layout | `ListingContent` | loading, empty, list, list-footer CTA, search-empty CTA |
| Header | `ListingScreenHeader` | title + compact "+ New" |
| Screen | `app/(tabs)/*/index.tsx` | hooks, filter/search state, map rows, pass props |

1. **Header (always):** compact primary `Button` (`size="sm"`) on the right of the page title, linking to the entity's `/new` stack route.
2. **List footer (scrollable):** when search is inactive and the visible item count exceeds five, append a `ListNewItem` as the last row inside the scroll content — not sticky, not a `BottomActionBar`.
3. **Search-empty body CTA:** when search is active (`query.trim()` non-empty) and zero results, show a full-width primary `Button` inside `EmptyState`'s `action` slot.

Only search counts as "filtering" for rules 2–3. Category chips, `SelectInput` filters, favorites-only, and sort do not suppress the list-footer button. Products count items as the sum of rows across all grouped sections.

Do not use `BottomActionBar` on catalog tab listings; reserve it for stack detail screens. Reload related hooks together with `useReloadOnFocus(reloadA, reloadB, ...)`.

## Text And Theme

- Use `useTranslation()` for labels/descriptions/status text.
- Do not translate user data displayed in rows or titles.
- Use `text-foreground`, `text-card-foreground`, `text-muted-foreground`, `bg-background`, and `bg-card` instead of raw colors.
