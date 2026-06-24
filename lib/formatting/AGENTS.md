# Formatting

## Locale-Aware Output

- Use these helpers for user-visible currency, date, and number formatting.
- Prefer passing the active `SupportedLocale` instead of relying on defaults when rendering screen values.
- Do not format user-entered names or notes; only format numeric/date/currency values.

## Defaults

- Defaults exist for tests and fallback paths, but feature UI should use locale-aware values where available.
- Keep currency assumptions explicit. The current V1 formatter defaults to EUR.
