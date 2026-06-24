import { useCallback, useEffect, useState } from 'react';

import { getPersistedLocale, i18n, setPersistedLocale, type SupportedLocale } from '@/lib/i18n';

export function useLocale() {
  const [locale, setLocaleState] = useState<SupportedLocale>((i18n.language as SupportedLocale) || 'en');

  useEffect(() => {
    void getPersistedLocale().then(setLocaleState);
  }, []);

  const setLocale = useCallback(async (nextLocale: SupportedLocale) => {
    await setPersistedLocale(nextLocale);
    setLocaleState(nextLocale);
  }, []);

  return { locale, setLocale };
}
