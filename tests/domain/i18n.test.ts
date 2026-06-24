import { resources } from '@/lib/i18n/resources';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') {
    return [prefix];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('i18n resources', () => {
  it('keeps English and Spanish translation keys in parity', () => {
    const englishKeys = flattenKeys(resources.en.translation).sort();
    const spanishKeys = flattenKeys(resources.es.translation).sort();

    expect(spanishKeys).toEqual(englishKeys);
  });

  it('includes required top-level namespaces', () => {
    expect(Object.keys(resources.en.translation).sort()).toEqual([
      'actions',
      'backup',
      'categories',
      'common',
      'errors',
      'forms',
      'navigation',
      'pantry',
      'products',
      'recipes',
      'settings',
      'shopping',
      'validation',
    ]);
  });
});
