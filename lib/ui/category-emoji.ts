// ponytail: categories have no emoji column, so we map common names to a glyph
// for the list section headers. Unknown names fall back to a neutral basket.
// Extend the map as needed; matching is case-insensitive on the category name.
const CATEGORY_EMOJI: Record<string, string> = {
  vegetables: '🥦',
  vegetable: '🥦',
  fruits: '🍎',
  fruit: '🍎',
  dairy: '🥛',
  meat: '🥩',
  fish: '🐟',
  seafood: '🦐',
  bakery: '🥖',
  bread: '🥖',
  drinks: '🥤',
  beverages: '🥤',
  snacks: '🍿',
  frozen: '🧊',
  pantry: '🫙',
  grains: '🌾',
  pasta: '🍝',
  spices: '🧂',
  condiments: '🧂',
  sweets: '🍬',
  household: '🧽',
};

export function categoryEmoji(name: string | null | undefined): string {
  if (!name) return '🛒';
  return CATEGORY_EMOJI[name.trim().toLowerCase()] ?? '🛒';
}

// A product's display glyph: its category's chosen emoji, else a carrot fallback.
export function productEmoji(
  categoryId: string | null | undefined,
  categories: { id: string; description: string | null }[],
): string {
  const category = categoryId ? categories.find((c) => c.id === categoryId) : null;
  return category?.description || '🥕';
}
