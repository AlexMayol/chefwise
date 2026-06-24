# Domain Components

## Collection Pattern

- Collection tabs use `CollectionScreen`: grid of items, action button below, full-screen form state for create/edit.
- Mark grid items `editable: true` when tapping should open the form with existing values.
- `CollectionScreen` is intentionally opaque/full-screen while editing to avoid modal opacity and tab bar stacking bugs.

## Feature Forms

- Forms should accept `initialValues` when used for editing.
- Submit callbacks should receive repository input types, not raw React Hook Form internals.
- Image fields must persist relative paths from `lib/images/storage.ts`, never picker or filesystem absolute URIs.

## Selectors

- Use `ProductSelector` for product choices; it sorts favorites first.
- Use `MarketSelector` for market choices.
- Price and recipe cost UI should show user names for products/markets, not internal IDs, whenever product/market lists are available.
