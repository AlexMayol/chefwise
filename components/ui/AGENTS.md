# UI Primitives

## Scope

- Keep these components generic: no Chefwise domain imports, no repository hooks, no route knowledge.
- Prefer small props and composition over feature-specific variants.
- **Own repeated screen structure here.** When multiple routes share the same loading/empty/list/header pattern, implement it once in `components/ui/` and keep `app/` routes as thin composers (see `ListingContent`).

## Compositional pattern

Split responsibilities the way catalog listings do:

1. **Pure display state** in `lib/ui/` — e.g. `getListingCreateVisibility(query, itemCount)`.
2. **Structural UI** in `components/ui/` — e.g. `ListingContent` reads helper output and renders `LoadingState` / `EmptyState` / list / `ListNewItem`.
3. **Screen** in `app/` — hooks, local filter/search state, map domain rows, pass props.

Do not inline in a route what already fits a reusable UI primitive. Add props or a sibling component instead of forking copy-paste.

## Styling Rules

- Use semantic token classes from Tailwind/NativeWind: `primary`, `secondary`, `destructive`, `background`, `foreground`, `card`, `muted`, `border`, and `input`.
- `Input` owns placeholder color through design tokens. Do not reintroduce hardcoded placeholder colors in callers.
- `Button` variants should remain visually consistent across light and dark themes.

## Components

- `Collapsible` (`collapsible.tsx`): animates its children's height between 0 and their natural height. Use it for any expand/collapse — accordions, show-more sections, reveal panels — instead of conditionally rendering or hand-rolling height animation. It's body-only: the caller owns the trigger and the `expanded` boolean (see `domain/category-section.tsx`).
- `ListingScreenHeader` (`listing-screen-header.tsx`): page title + compact header "+ New" button for catalog tab listings. Pass `title`, `newHref`, and `newLabel`.
- `ListingContent` (`listing-content.tsx`): **canonical example** of a compositional UI primitive — loading, empty, list, and optional list-footer create affordances for catalog tab listings. Pass `loading`, `sourceEmpty`, `itemCount`, `query`, `newHref`, `newLabel`, `emptyTitle`, and list `children`. Calls `getListingCreateVisibility` internally; screens must not reimplement its branches.
- `ListNewItem` (`list-new-item.tsx`): scrollable list-footer "+ New" row for long unfiltered lists. Full-width primary `Button` (same green styling as the old `BottomActionBar` CTAs). Not sticky — render as the last item inside `ScreenScaffold` content when `shouldShowListFooterNew` is true.
- `ListingCreateEmptyAction` (`listing-content.tsx`): full-width primary create button for search-empty states inside `EmptyState`.
- `EmptyState` (`empty-state.tsx`): optional `action` slot for a full-width create button when search returns no results (`shouldShowFilteredEmptyNew`).

## Accessibility And Behavior

- Keep touch targets large enough for mobile.
- Preserve disabled states and `active:opacity-80` feedback unless replacing with an equivalent pattern.
