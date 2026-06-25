import { useCallback, useEffect, useState } from 'react';

// Minimal CRUD surface a collection hook drives. Repositories may expose more
// (e.g. addIngredient) — those are layered on by the entity hook.
export type CrudRepository<T, Input> = {
  list(): Promise<T[]>;
  create(input: Input): Promise<T>;
  update(id: string, input: Partial<Input>): Promise<void>;
  delete(id: string): Promise<void>;
};

// Generic items/loading/reload + create/update/remove over a repository. Every
// mutation reloads. The repo must be referentially stable (the DB provider
// memoizes `repositories`, so it is).
export function useCollection<T, Input>(repo: CrudRepository<T, Input>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await repo.list());
    } finally {
      setLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: Input) => {
      const created = await repo.create(input);
      await reload();
      return created;
    },
    [reload, repo],
  );

  const update = useCallback(
    async (id: string, input: Partial<Input>) => {
      await repo.update(id, input);
      await reload();
    },
    [reload, repo],
  );

  const remove = useCallback(
    async (id: string) => {
      await repo.delete(id);
      await reload();
    },
    [reload, repo],
  );

  return { items, loading, reload, create, update, remove };
}
