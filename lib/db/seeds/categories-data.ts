// Default categories seeded on fresh install, in the device language.
// Pure data (no React Native imports) so CLI scripts can reuse it.
// `description` holds the category emoji; it is locale-independent (same order).
// 'Other' stays last; new categories are inserted before it. Product seeds only reference
// indices 0-8, so appending here never shifts an index a product depends on.
const DEFAULT_CATEGORY_EMOJIS = ['🥦', '🍎', '🥩', '🐟', '🧀', '🥖', '🥫', '🧊', '🥤', '🍿', '🍬', '🌿', '🍚', '🫘', '🥜', '🧂', '☕', '🥣', '🧼', '🏷️'];

const DEFAULT_CATEGORY_NAMES: Record<'en' | 'es', string[]> = {
  en: ['Vegetables', 'Fruits', 'Meat', 'Fish & Seafood', 'Dairy & Eggs', 'Bakery', 'Pantry', 'Frozen', 'Drinks', 'Snacks', 'Sweets & Candy', 'Spices & Herbs', 'Pasta & Rice', 'Legumes', 'Nuts & Seeds', 'Condiments & Sauces', 'Coffee & Tea', 'Breakfast & Cereal', 'Household', 'Other'],
  es: ['Verduras', 'Frutas', 'Carne', 'Pescado y marisco', 'Lácteos y huevos', 'Panadería', 'Despensa', 'Congelados', 'Bebidas', 'Aperitivos', 'Dulces', 'Especias y hierbas', 'Pasta y arroz', 'Legumbres', 'Frutos secos y semillas', 'Condimentos y salsas', 'Café y té', 'Desayuno y cereales', 'Hogar', 'Otros'],
};

export const DEFAULT_CATEGORIES: Record<'en' | 'es', { name: string; description: string }[]> = {
  en: DEFAULT_CATEGORY_NAMES.en.map((name, i) => ({ name, description: DEFAULT_CATEGORY_EMOJIS[i] })),
  es: DEFAULT_CATEGORY_NAMES.es.map((name, i) => ({ name, description: DEFAULT_CATEGORY_EMOJIS[i] })),
};
