# Components

## Boundaries

- `components/ui/` should stay generic and feature-agnostic.
- `components/domain/` may know Chefwise concepts such as products, markets, recipes, pantry, and backup.
- Components should receive data and callbacks from screens/hooks; avoid importing repositories or database providers here.

## Styling

NativeWind v5 (built on `react-native-css`) targets native and web from one codebase — every rule below is about staying correct on **both**.

- Use NativeWind semantic token classes. Do not hardcode content colors.
- Prefer existing primitives (`Button`, `Card`, `Input`, `Select`, `ListRow`, `EmptyState`, `FormField`) before adding new visual patterns.
- Keep dark-mode behavior token-driven through `lib/theme/tokens.ts`.
- Prefer NativeWind classes over inline `style`. Reach for inline `style` only for values className can't express: safe-area insets (`paddingTop: insets.top + 16`), measured/animated values, `maxHeight` one-offs. `className` + inline `style` on the same element is safe — they merge property-by-property; mix them freely.

### Never split styling across a `*ClassName` and its matching `*Style` prop

`contentContainerClassName` compiles to `contentContainerStyle` (ScrollView / FlatList / SectionList). Passing **both** on the same element does NOT merge — the inline `contentContainerStyle` object silently overwrites everything the className produced (padding survives, `gap` vanishes). The bug is native-only; on web both apply, so it's easy to miss.

Keep all content-container styling in `contentContainerStyle` — `gap` and `padding` together, never `contentContainerClassName`:

```tsx
// ✅ matches feature-screen.tsx / collection-screen.tsx / detail screens
<ScrollView
  className="flex-1 bg-background"
  contentContainerStyle={{ gap: 16, paddingTop: insets.top + 16, paddingBottom: 16, paddingHorizontal: 20 }}>

// ❌ inline object wipes out the className gap on native
<ScrollView contentContainerClassName="gap-4" contentContainerStyle={{ paddingHorizontal: 20 }}>
```

Why: `react-native-css` merges the `style` target property-by-property (into a style array), but every other mapped target (`contentContainerStyle`) is shallow-replaced by the inline prop. See `deepMergeConfig` / `mergeDefinedProps` in `react-native-css/src/native/styles/index.ts`.

## Forms

- Feature forms use React Hook Form with Zod resolvers from `lib/validation/`.
- Pass localized validation keys through `t(...)`; schemas should store keys, not rendered messages.
- For selectors, prefer product/market picker components over raw ID text inputs.
