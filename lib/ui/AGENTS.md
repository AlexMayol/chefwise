# UI Helpers

## Purpose

- Keep pure UI calculation helpers here, such as grid chunking and reusable display-state decisions.
- These helpers should not import React components, hooks, repositories, or Expo APIs.
- **Pair helpers with UI components** — the helper decides *what* to show; the component renders it. Example: `getListingCreateVisibility` in `listing-create-actions.ts` is consumed by `ListingContent`, not duplicated in route files.

## When to add a helper

Extract to `lib/ui/` when two or more screens (or a screen and a UI component) share the same boolean/layout decision from plain inputs. Keep screens and components free of copy-pasted `if (loading && …)` / `if (count === 0)` trees.

## Testing

- Add small domain-style tests under `tests/domain/` when changing helper behavior.
- Keep helper output deterministic and easy to assert.
