// Default recipe categories seeded on first launch, in the device language.
// Pure data (no React Native imports) so CLI scripts can reuse it.
// Emoji is locale-independent (same order). User content (names) is translated only here,
// at seed time, for the device locale — never translated again at runtime.
const DEFAULT_RECIPE_CATEGORY_EMOJIS = ['🍝', '🥗', '🍰', '🥣', '🥪', '🥞', '🍽️'];

const DEFAULT_RECIPE_CATEGORY_NAMES: Record<'en' | 'es', string[]> = {
  en: ['Main dishes', 'Starters', 'Desserts', 'Soups', 'Snacks', 'Breakfast', 'Sides'],
  es: ['Platos principales', 'Entrantes', 'Postres', 'Sopas', 'Aperitivos', 'Desayuno', 'Guarniciones'],
};

export const DEFAULT_RECIPE_CATEGORIES: Record<'en' | 'es', { name: string; emoji: string }[]> = {
  en: DEFAULT_RECIPE_CATEGORY_NAMES.en.map((name, i) => ({ name, emoji: DEFAULT_RECIPE_CATEGORY_EMOJIS[i] })),
  es: DEFAULT_RECIPE_CATEGORY_NAMES.es.map((name, i) => ({ name, emoji: DEFAULT_RECIPE_CATEGORY_EMOJIS[i] })),
};
