# Theme Tokens

## Token Source

- `tokens.ts` is the source of truth for light and dark semantic colors.
- `app/_layout.tsx` passes these tokens to NativeWind with `VariableContextProvider`.
- `tailwind.config.js` and `global.css` must stay aligned with these token names.

## Styling Decisions

- Use semantic names: background, foreground, card, muted, primary, secondary, destructive, border, input, and ring.
- Do not hardcode black or white text in screens/components.
- Placeholder colors come from `inputPlaceholder`.

## Testing

- Update `tests/domain/theme-tokens.test.ts` when changing token names or expected contrast-critical values.
