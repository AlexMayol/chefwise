import { useCallback, useEffect, useRef, useState } from 'react';

// Loads one entity (or a list) for a given id, short-circuiting to `empty` when
// the id is absent. `load` must be referentially stable (wrap it in useCallback);
// `empty` is pinned on first render so an inline `[]`/`null` is fine.
export function useDetail<T>(id: string | undefined, load: (id: string) => Promise<T>, empty: T) {
  const emptyRef = useRef(empty);
  const [item, setItem] = useState<T>(empty);
  const [loading, setLoading] = useState(Boolean(id));

  const reload = useCallback(async () => {
    if (!id) {
      setItem(emptyRef.current);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setItem(await load(id));
    } finally {
      setLoading(false);
    }
  }, [id, load]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { item, loading, reload };
}
