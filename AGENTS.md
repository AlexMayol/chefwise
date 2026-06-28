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

- `app/` contains Expo Router routes and screen composition only.
- `components/ui/` contains small reusable primitives.
- `components/domain/` contains feature-aware form/list/picker components.
- `lib/db/` owns SQLite schema, migrations, and repositories.
- `lib/domain/` owns pure business rules and should be testable without React.
- `lib/hooks/` bridges repositories/domain services into React state.
- `tests/` contains Jest coverage for domain, repository, and screen behavior.

## Verification

- For behavior changes, add or update a focused test first.
- Run `npm test` and `npm run typecheck -- --pretty false` before claiming completion.
