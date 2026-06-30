# Chefwise Agent Guide

## Non-Negotiables

- Read the exact versioned Expo SDK 56 docs at https://docs.expo.dev/versions/v56.0.0/ before writing code that touches Expo APIs.
- Chefwise is a local-first offline Expo app. Do not add cloud sync, accounts, shared lists, AI features, barcode/OCR, push notifications, or cloud backup.
- Store all user data locally in SQLite and the device document directory.
- Store image paths in SQLite as relative paths only, for example `images/products/product-id.jpg`.
- All user-facing app text must go through i18next English and Spanish resources. Never translate user content such as product, market, category, or recipe names.
- When a translation key is no longer referenced anywhere, always delete it from both the English and Spanish resources. Never leave orphan i18n keys behind.
- Use semantic design tokens and NativeWind classes for color. Do not hardcode black/white text or one-off colors in screens.

## Architecture

- `app/` contains Expo Router routes and **slim screen composition only** — wire hooks and shared components; do not grow inline layout branches or display-state logic in route files (see **Slim screens** below).
- `components/ui/` contains small reusable primitives and cross-screen layout pieces.
- `components/domain/` contains feature-aware form/list/picker components.
- `lib/db/` owns SQLite schema, migrations, and repositories.
- `lib/domain/` owns pure business rules and should be testable without React.
- `lib/hooks/` bridges repositories/domain services into React state.
- `lib/ui/` owns pure display-state helpers paired with UI components (no React).
- `tests/` contains Jest coverage for domain, repository, and screen behavior.

## Slim screens

Route files compose; they do not implement. When the same structure, visibility rules, or lifecycle appear on more than one screen, extract before copying:

1. **Pure rules** → `lib/domain/` (business) or `lib/ui/` (display state), with tests under `tests/domain/`.
2. **Data and side effects** → `lib/hooks/` (fetch, reload, focus refresh, mutations).
3. **Generic layout and behavior** → `components/ui/` (no domain imports).
4. **Feature-specific rows/forms/pickers** → `components/domain/`.

**Reference:** catalog tab listings use `getListingCreateVisibility` + `ListingContent` + `ListingScreenHeader` so each `app/(tabs)/*/index.tsx` only supplies filtered data, search query, and screen-specific chrome. Follow that split for new listing or collection screens — screens stay thin; shared behavior lives in helpers, hooks, and UI.

## Features

- **Recipes** is the flagship section. Before any recipe or recipe-category work, read `app/recipes/AGENTS.md` — it maps the full vertical slice (schema → cost engine → hooks → screens), the deliberate v1 scope cuts, and how to expand it.

## Verification

- For behavior changes, add or update a focused test first.
- Run `npm test` and `npm run typecheck -- --pretty false` before claiming completion.
