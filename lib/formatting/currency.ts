import type { SupportedLocale } from '@/lib/i18n';

export function formatCurrency(value: number, locale: SupportedLocale = 'en', currency = 'EUR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}
