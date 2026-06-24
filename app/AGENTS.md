# App Routes

## Screen Responsibilities

- Expo Router files compose screens from hooks and components; keep business rules in `lib/domain/` and persistence in repositories.
- Bottom tab screens use in-page titles via `CollectionScreen` or `FeatureScreen`; keep the global native tab header hidden.
- Detail routes such as `products/[productId].tsx`, `recipes/[recipeId].tsx`, and `shopping/[shoppingListId].tsx` load data through hooks and should avoid direct database access.
- Modal-style create/edit flows use the full-screen `CollectionScreen` form state. The collection screen closes transient form state on route blur.

## Navigation

- Register every new stack route in `app/_layout.tsx`; the root stack is not inferred for these explicit screens.
- Tab definitions live in `lib/navigation/tabs.ts`; update that file and translations together when changing tabs.
- Use typed `Href` casts for dynamic links where Expo Router cannot infer string literals.
- Keep mobile as the V1 target. Web compatibility is useful, but do not choose web-only patterns over mobile behavior.
- There are two create patterns today: tab grids use inline `CollectionScreen` forms, while `/new` stack routes exist and call `router.back()`. Prefer the inline pattern for tab list actions unless deliberately standardizing the app.
- Known gap: `markets/[marketId].tsx` does not currently load the market by id for editing; do not copy that pattern into new detail screens.

## Text And Theme

- Use `useTranslation()` for labels/descriptions/status text.
- Do not translate user data displayed in rows or titles.
- Use `text-foreground`, `text-card-foreground`, `text-muted-foreground`, `bg-background`, and `bg-card` instead of raw colors.
