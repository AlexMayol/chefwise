// Sample products seeded in dev/test only (see seeds/dev.ts).
// Pure data (no React Native imports) so CLI scripts can reuse it.
// categoryIndex -> categories-data.ts order: Vegetables, Fruits, Meat, Fish, Dairy,
//   Bakery, Pantry, Frozen, Drinks, Other.
// marketIndex -> markets-data.ts order.
import type { Unit } from '@/lib/domain/units';

export type ProductSeed = {
  name: string;
  categoryIndex: number;
  marketIndex: number;
  defaultUnit: Unit;
  rating: number | null;
  notes: string | null;
  isFavorite: boolean;
};

// One spec per product; en/es names paired so structural fields never drift between locales.
type ProductSpec = Omit<ProductSeed, 'name'> & { en: string; es: string };

const PRODUCT_SPECS: ProductSpec[] = [
  { en: 'Tomatoes', es: 'Tomates', categoryIndex: 0, marketIndex: 1, defaultUnit: 'kg', rating: 4, notes: 'Vine-ripened', isFavorite: true },
  { en: 'Carrots', es: 'Zanahorias', categoryIndex: 0, marketIndex: 1, defaultUnit: 'kg', rating: 3, notes: null, isFavorite: false },
  { en: 'Spinach', es: 'Espinacas', categoryIndex: 0, marketIndex: 0, defaultUnit: 'g', rating: 4, notes: null, isFavorite: false },
  { en: 'Apples', es: 'Manzanas', categoryIndex: 1, marketIndex: 1, defaultUnit: 'kg', rating: 5, notes: 'Crisp', isFavorite: true },
  { en: 'Bananas', es: 'Plátanos', categoryIndex: 1, marketIndex: 0, defaultUnit: 'kg', rating: 4, notes: null, isFavorite: false },
  { en: 'Oranges', es: 'Naranjas', categoryIndex: 1, marketIndex: 1, defaultUnit: 'kg', rating: 3, notes: null, isFavorite: false },
  { en: 'Chicken Breast', es: 'Pechuga de pollo', categoryIndex: 2, marketIndex: 2, defaultUnit: 'kg', rating: 5, notes: 'Free-range', isFavorite: true },
  { en: 'Ground Beef', es: 'Carne picada', categoryIndex: 2, marketIndex: 2, defaultUnit: 'kg', rating: 4, notes: null, isFavorite: false },
  { en: 'Pork Chops', es: 'Chuletas de cerdo', categoryIndex: 2, marketIndex: 2, defaultUnit: 'kg', rating: 3, notes: null, isFavorite: false },
  { en: 'Salmon Fillet', es: 'Filete de salmón', categoryIndex: 3, marketIndex: 3, defaultUnit: 'kg', rating: 5, notes: 'Fresh', isFavorite: true },
  { en: 'Shrimp', es: 'Gambas', categoryIndex: 3, marketIndex: 3, defaultUnit: 'g', rating: 4, notes: null, isFavorite: false },
  { en: 'Milk', es: 'Leche', categoryIndex: 4, marketIndex: 0, defaultUnit: 'l', rating: 3, notes: null, isFavorite: false },
  { en: 'Eggs', es: 'Huevos', categoryIndex: 4, marketIndex: 0, defaultUnit: 'unit', rating: 4, notes: 'Dozen', isFavorite: true },
  { en: 'Cheddar Cheese', es: 'Queso cheddar', categoryIndex: 4, marketIndex: 0, defaultUnit: 'g', rating: 4, notes: null, isFavorite: false },
  { en: 'Baguette', es: 'Baguette', categoryIndex: 5, marketIndex: 4, defaultUnit: 'unit', rating: 5, notes: 'Daily fresh', isFavorite: true },
  { en: 'Croissants', es: 'Cruasanes', categoryIndex: 5, marketIndex: 4, defaultUnit: 'unit', rating: 4, notes: null, isFavorite: false },
  { en: 'Olive Oil', es: 'Aceite de oliva', categoryIndex: 6, marketIndex: 5, defaultUnit: 'l', rating: 5, notes: 'Extra virgin', isFavorite: true },
  { en: 'Pasta', es: 'Pasta', categoryIndex: 6, marketIndex: 5, defaultUnit: 'g', rating: 3, notes: null, isFavorite: false },
  { en: 'Frozen Peas', es: 'Guisantes congelados', categoryIndex: 7, marketIndex: 0, defaultUnit: 'g', rating: 3, notes: null, isFavorite: false },
  { en: 'Orange Juice', es: 'Zumo de naranja', categoryIndex: 8, marketIndex: 0, defaultUnit: 'l', rating: 4, notes: null, isFavorite: false },
];

export const DEFAULT_PRODUCTS: Record<'en' | 'es', ProductSeed[]> = {
  en: PRODUCT_SPECS.map(({ en, es: _es, ...rest }) => ({ name: en, ...rest })),
  es: PRODUCT_SPECS.map(({ es, en: _en, ...rest }) => ({ name: es, ...rest })),
};
