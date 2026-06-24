# Domain Rules

## Pure Logic

- Keep these modules free of React, SQLite, Expo Router, and component imports.
- Prefer dependency injection through function parameters for workflows that need persistence callbacks.
- Unit tests in `tests/domain/` should cover every behavior change here.

## Units And Pricing

- Supported units are `g`, `kg`, `ml`, `l`, `tsp`, `tbsp`, and `unit`.
- `tsp = 5 ml` and `tbsp = 15 ml`.
- Normalize prices to `kg`, `l`, or `unit`.
- Reject conversions across mass, volume, and count dimensions.

## Recipes, Shopping, Pantry

- Recipe costs are complete only when every ingredient has a compatible latest price. Incomplete results keep `totalCost` and `costPerServing` null.
- Cheapest recipe pricing compares normalized compatible latest prices across markets.
- Latest price ordering is `observedAt DESC, id DESC`; keep repository and domain tests aligned when changing price selection.
- Bought shopping items must create a price, update the item, increase pantry, and record a purchase transaction atomically.
- Pantry changes should always have matching ledger transactions.

## Backup

- Backup archives contain `manifest.json`, `database.sqlite`, and `images/`.
- Validate manifest and database presence before replacing local data.
- Full restore stages files before touching current data; do not add merge/conflict resolution for V1.
