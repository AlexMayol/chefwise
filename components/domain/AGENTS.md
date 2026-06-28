# Domain Components

## Collection Pattern

- Collection tabs use `CollectionScreen`: grid of items, action button below, full-screen form state for create/edit.
- Mark grid items `editable: true` when tapping should open the form with existing values.
- `CollectionScreen` is intentionally opaque/full-screen while editing to avoid modal opacity and tab bar stacking bugs.
- Cards must surface the entity's most valuable data, not just a name. Map it to `title` / `subtitle` / `meta`, where `meta` is the prominent value slot (e.g. products show name / market / price-per-unit). Enrich that data in the repository `list()` query, never via per-row lookups in the screen.
- Give every card a visual header: pass `imageUri` (resolved from the entity's relative `imagePath` via `lib/images/storage`) and an `emoji` placeholder. `GridCard` shows the image when present, otherwise the emoji in a placeholder box.

## Cards

- The grid card is `components/ui/grid-card.tsx` (`GridCard` + the `CollectionItem` shape). It is the single source of truth for how an entity card looks — reuse it; do not re-implement a card.
- To render products outside the catalog grid (detail screens, etc.), use `ProductGrid` (`product-grid.tsx`). It maps each `ProductListItem` through `productToCollectionItem` into a `GridCard`, so products look identical everywhere. A product's `meta` shows its cheapest current offer price (`bestNormalizedPrice`).

## Detail Screens

- Tapping an entity card opens a detail screen (`app/<entity>/[id].tsx`), reached via the card's `href` — not the inline edit modal. The catalog grids set `href`; only the create flow uses the `CollectionScreen` modal.
- Detail screens follow one shape: a back header (← + emoji + name), the related entities at the top (e.g. a market/category lists its products via `ProductGrid`), then an **Edit** button that opens the entity's form in a `BottomSheet`.
- `BottomSheet` is draggable-to-resize by default (fixed height + drag handle). For a form, use the fill layout so the body scrolls and the submit button never gets pushed off-screen: wrap in `<View className="flex-1 gap-4">` with the `FormScreenHeader` pinned on top and the form inside `<ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">`. For short, non-form sheets (action menus, select/creatable dropdowns, filter panels, delete-confirm) pass `resizable={false}` so the sheet hugs its content instead of opening at a fixed height; those cap their own scroll with `maxHeight` ~480 when needed.

## Feature Forms

- Forms should accept `initialValues` when used for editing.
- Submit callbacks should receive repository input types, not raw React Hook Form internals.
- Image fields must persist relative paths from `lib/images/storage.ts`, never picker or filesystem absolute URIs.

## Selectors

- Use `ProductSelector` for product choices; it sorts favorites first.
- A product is generic. Markets/brands/sizes are `product_offers` created on the product detail screen via `OfferForm`; a recipe ingredient can pick a specific offer (or "cheapest") in `RecipeProductForm`.
- Price and recipe cost UI should show user names for products, not internal IDs, whenever product lists are available.
- For a select whose options are a user-created entity (market, category), use `CreatableSelect` (`components/ui/creatable-select.tsx`): it pairs a `SelectInput` dropdown with an "add" button that opens the entity's form in a `BottomSheet` and selects the newly created row via `onCreated(id)`. Prefer this over a plain `Select` so users can create on the fly without leaving the form.
- Use the `SelectInput` dropdown (not the pill `Select`) when the option list can grow long; keep the pill `Select` for small fixed sets (units, sort, language).
