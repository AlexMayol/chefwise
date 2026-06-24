# UI Primitives

## Scope

- Keep these components generic: no Chefwise domain imports, no repository hooks, no route knowledge.
- Prefer small props and composition over feature-specific variants.

## Styling Rules

- Use semantic token classes from Tailwind/NativeWind: `primary`, `secondary`, `destructive`, `background`, `foreground`, `card`, `muted`, `border`, and `input`.
- `Input` owns placeholder color through design tokens. Do not reintroduce hardcoded placeholder colors in callers.
- `Button` variants should remain visually consistent across light and dark themes.

## Accessibility And Behavior

- Keep touch targets large enough for mobile.
- Preserve disabled states and `active:opacity-80` feedback unless replacing with an equivalent pattern.
