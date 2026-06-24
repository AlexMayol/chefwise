import type { SupportedLocale } from '@/lib/i18n';

export function formatDate(value: string | Date, locale: SupportedLocale = 'en'): string {
  const date = typeof value === 'string' ? new Date(value) : value;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(date);
}
