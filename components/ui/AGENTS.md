# UI Primitives

## Scope

- Keep these components generic: no Chefwise domain imports, no repository hooks, no route knowledge.
- Prefer small props and composition over feature-specific variants.

## Styling Rules

- Use semantic token classes from Tailwind/NativeWind: `primary`, `secondary`, `destructive`, `background`, `foreground`, `card`, `muted`, `border`, and `input`.
- `Input` owns placeholder color through design tokens. Do not reintroduce hardcoded placeholder colors in callers.
- `Button` variants should remain visually consistent across light and dark themes.

## Components

- `Collapsible` (`collapsible.tsx`): animates its children's height between 0 and their natural height. Use it for any expand/collapse — accordions, show-more sections, reveal panels — instead of conditionally rendering or hand-rolling height animation. It's body-only: the caller owns the trigger and the `expanded` boolean (see `domain/category-section.tsx`).

## Accessibility And Behavior

- Keep touch targets large enough for mobile.
- Preserve disabled states and `active:opacity-80` feedback unless replacing with an equivalent pattern.
