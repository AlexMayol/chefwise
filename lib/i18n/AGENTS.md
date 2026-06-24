# Internationalization

## Rules

- All app chrome, labels, actions, errors, validation messages, statuses, and empty states go through i18next resources.
- Keep English and Spanish keys in parity. Update `resources/en.ts` and `resources/es.ts` together.
- Never translate user-created content: product names, notes, category names, market names, recipe names, or descriptions.

## Locale Behavior

- Device Spanish defaults to Spanish; unsupported locales fall back to English.
- Manual language changes persist through AsyncStorage.
- Guard AsyncStorage and Expo Localization access for web/server rendering.

## Formatting

- Use `lib/formatting/` helpers for currency, dates, and numbers.
- Prefer passing the current locale when formatting user-visible values.
