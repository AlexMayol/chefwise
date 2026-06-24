# Components

## Boundaries

- `components/ui/` should stay generic and feature-agnostic.
- `components/domain/` may know Chefwise concepts such as products, markets, recipes, pantry, and backup.
- Components should receive data and callbacks from screens/hooks; avoid importing repositories or database providers here.

## Styling

- Use NativeWind semantic token classes. Do not hardcode content colors.
- Prefer existing primitives (`Button`, `Card`, `Input`, `Select`, `ListRow`, `EmptyState`, `FormField`) before adding new visual patterns.
- Keep dark-mode behavior token-driven through `lib/theme/tokens.ts`.

## Forms

- Feature forms use React Hook Form with Zod resolvers from `lib/validation/`.
- Pass localized validation keys through `t(...)`; schemas should store keys, not rendered messages.
- For selectors, prefer product/market picker components over raw ID text inputs.
