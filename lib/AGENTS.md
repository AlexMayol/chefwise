# Library Layer

## Ownership

- `db/` owns persistence structure and SQL access.
- `domain/` owns pure business rules and workflow invariants.
- `hooks/` adapts repositories/domain services to React state.
- `validation/` owns Zod schemas for forms and localized validation keys.
- `i18n/`, `formatting/`, `theme/`, and `images/` own cross-cutting app services.

## Decisions

- The app is offline-only and local-first.
- Product prices are immutable: create new rows, never update historical prices.
- Recipe costs are incomplete when any ingredient lacks a compatible price; do not expose partial totals as final totals.
- Shopping purchase flow must create a price, mark item bought, update pantry, and create a pantry transaction in one SQLite transaction.
- Backup import validates and stages before replacing current local data.

## Dependency Direction

- Repositories may use low-level helpers and domain normalization where needed.
- Domain modules should not import React, hooks, or UI.
- Hooks may combine repositories and domain functions.
- UI should call hooks, not repositories directly.
