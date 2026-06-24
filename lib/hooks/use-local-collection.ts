import { useCallback, useMemo, useState } from 'react';

export function useLocalCollection<T extends { id: string }>(initialItems: T[] = []) {
  const [items, setItems] = useState(initialItems);

  const byId = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  const upsert = useCallback((item: T) => {
    setItems((current) => {
      const rest = current.filter((candidate) => candidate.id !== item.id);
      return [item, ...rest];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  return { items, byId, upsert, remove, loading: false };
}
