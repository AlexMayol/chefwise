# Hooks

## Role

- Hooks are the React adapter layer over repositories and domain services.
- Screens should call hooks; components should receive values/callbacks from screens unless a selector component intentionally owns a catalog hook.
- Keep loading state and reload functions consistent: writes should usually call `reload()` before returning.

## Repository Access

- Use `useAppDatabase()` only in hooks or provider-adjacent code.
- Do not call repositories directly from route files unless there is no hook yet; prefer creating a hook.

## Workflow Hooks

- `useShoppingListDetail` must keep the bought flow atomic through `db.withTransactionAsync`.
- `usePantry` returns current inventory and transaction history; adjustments must create ledger entries.
- `useRecipeDetail` combines recipe data, ingredients, latest prices, pantry consumption, and recipe costing.
- `useRecipeDetail.cook` currently validates pantry availability in memory, then adjusts pantry per ingredient. Treat a future single-transaction cook flow as a behavior change that needs tests.

## Selector Hooks

- Product selectors use `useProducts({ sort: 'favorites_first' })`.
- Market selectors use `useMarkets()`.
