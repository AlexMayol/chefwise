import { useRouter } from 'expo-router';
import { useCallback } from 'react';

// Wraps a create call so the screen pops back once the entity is created.
// Forwards every argument (e.g. ProductForm passes an optional initial price).
export function useCreateAndNavigateBack<Args extends unknown[]>(create: (...args: Args) => Promise<unknown>) {
  const router = useRouter();

  return useCallback(
    async (...args: Args) => {
      await create(...args);
      router.back();
    },
    [create, router],
  );
}
