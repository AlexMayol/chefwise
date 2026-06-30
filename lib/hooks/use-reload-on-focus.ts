import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

type ReloadFn = () => Promise<unknown>;

// Each screen owns its own collection-hook state, so a list goes stale when a
// pushed sub-screen mutates the data. Refetch whenever the screen regains focus.
export function useReloadOnFocus(...reloads: ReloadFn[]) {
  useFocusEffect(
    useCallback(() => {
      void Promise.all(reloads.map((reload) => reload()));
    }, reloads),
  );
}
