import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

// Each screen owns its own collection-hook state, so a list goes stale when a
// pushed sub-screen mutates the data. Refetch whenever the screen regains focus.
export function useReloadOnFocus(reload: () => Promise<unknown>) {
  useFocusEffect(useCallback(() => void reload(), [reload]));
}
