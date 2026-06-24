import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';

import { resources, type SupportedLocale } from './resources';

const LANGUAGE_STORAGE_KEY = 'chefwise.locale';

function isWebServerRender(): boolean {
  return Platform.OS === 'web' && typeof window === 'undefined';
}

export function getDeviceDefaultLocale(): SupportedLocale {
  if (isWebServerRender()) {
    return 'en';
  }

  const languageCode = getLocales()[0]?.languageCode;
  return languageCode === 'es' ? 'es' : 'en';
}

export async function getPersistedLocale(): Promise<SupportedLocale> {
  if (isWebServerRender()) {
    return 'en';
  }

  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === 'es' || stored === 'en' ? stored : getDeviceDefaultLocale();
}

export async function setPersistedLocale(locale: SupportedLocale): Promise<void> {
  if (!isWebServerRender()) {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  }
  await i18n.changeLanguage(locale);
}

export async function initI18n(): Promise<typeof i18n> {
  if (i18n.isInitialized) {
    return i18n;
  }

  const locale = await getPersistedLocale();

  await i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    lng: locale,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n;
}

void initI18n();

export { i18n };
export { useTranslation } from 'react-i18next';
export type { SupportedLocale };
