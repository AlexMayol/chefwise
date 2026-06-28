import { categoryEmoji } from '@/lib/ui/category-emoji';

describe('categoryEmoji', () => {
  it('maps known categories case-insensitively', () => {
    expect(categoryEmoji('Vegetables')).toBe('🥦');
    expect(categoryEmoji('  dairy ')).toBe('🥛');
  });

  it('falls back to a neutral basket for unknown or empty names', () => {
    expect(categoryEmoji('Mystery Aisle')).toBe('🛒');
    expect(categoryEmoji(null)).toBe('🛒');
    expect(categoryEmoji(undefined)).toBe('🛒');
  });
});
