# UI Helpers

## Purpose

- Keep pure UI calculation helpers here, such as grid chunking and reusable display-state decisions.
- These helpers should not import React components, hooks, repositories, or Expo APIs.

## Testing

- Add small domain-style tests under `tests/domain/` when changing helper behavior.
- Keep helper output deterministic and easy to assert.
