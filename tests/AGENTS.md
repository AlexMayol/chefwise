# Tests

## Test Types

- `tests/domain/` covers pure business rules and should avoid React mocks.
- `tests/repositories/` covers SQL/query shape, repository contracts, migrations, and persistence invariants.
- `tests/screens/` covers user-visible screen behavior with hooks mocked at the data boundary.

## TDD

- For behavior changes, write a focused failing test first and verify the failure is for the expected reason.
- Prefer behavior assertions over checking that mocks exist or were rendered.
- Use full `npm test` and `npm run typecheck -- --pretty false` before completion.

## Common Mocks

- Mock `expo-router` in screen tests that import routed screens. Include `Link`, `useLocalSearchParams`, and `useFocusEffect` when the rendered tree uses them.
- Mock hooks like `useProducts`, `useMarkets`, `usePantry`, and `useRecipeDetail` to isolate screen behavior.
- `tests/setup.ts` supplies Expo Localization, AsyncStorage, and FileSystem mocks; extend it carefully when SDK API usage changes.
- NativeWind JSX runtime is mapped in `package.json`; keep that mapping when changing Jest config.

## Regression Targets

- Add tests for dark theme tokens, immutable prices, image path safety, backup staging, navigation lifecycle, and recipe/pantry/shopping workflows when changing those areas.
