import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'chefwise.theme';
const isWebServerRender = Platform.OS === 'web' && typeof window === 'undefined';

// ponytail: module-level store + useSyncExternalStore so the root layout and the
// settings screen share one value; changing it in settings re-themes the app live.
let preference: ThemePreference = 'system';
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

if (!isWebServerRender) {
  void AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      preference = stored;
      emit();
    }
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function setThemePreference(next: ThemePreference): Promise<void> {
  preference = next;
  emit();
  if (!isWebServerRender) {
    await AsyncStorage.setItem(STORAGE_KEY, next);
  }
}

export function useThemePreference() {
  const value = useSyncExternalStore(
    subscribe,
    () => preference,
    () => preference,
  );
  return { preference: value, setPreference: setThemePreference };
}
