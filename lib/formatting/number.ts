import type { SupportedLocale } from '@/lib/i18n';

export function formatNumber(value: number, locale: SupportedLocale = 'en', maximumFractionDigits = 2): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(value);
}
