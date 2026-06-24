# Repositories

## Patterns

- Repository methods should return typed domain records, not raw SQLite rows, when mapping is needed.
- Keep SQL ordering explicit; important examples are product price history (`observedAt DESC, id DESC`) and pantry transactions (`occurredAt DESC`).
- Use `db.withTransactionAsync` for multi-step writes that must be atomic.
- Keep generated IDs prefixed and stable in shape through `createId(prefix)`.
- `list()` queries may `LEFT JOIN` related tables (e.g. market name) and the latest `product_prices` row to feed rich list cards; return an enriched `*ListItem` type and keep heavier detail-only data out of list queries.

## Immutability

- `product-prices.ts` is append-only. New prices create new rows; latest price is derived by query order.
- Shopping purchases should reference the created `ProductPrice` row rather than mutating prior prices.

## Testing

- Add repository tests when changing SQL shape, ordering, transaction behavior, or delete rules.
- Recording database fakes are acceptable for query-shape tests; use behavior assertions rather than mock existence assertions.
