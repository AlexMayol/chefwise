export function shouldRenderListEmptyState(rows?: unknown[]): boolean {
  return rows !== undefined && rows.length === 0;
}
