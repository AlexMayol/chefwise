// Sample markets seeded in dev/test only (see seeds/dev.ts).
// Pure data (no React Native imports) so CLI scripts can reuse it.
// Names/addresses are user content, localized per locale, same order across locales.
export const DEFAULT_MARKETS: Record<'en' | 'es', { name: string; address: string }[]> = {
  en: [
    { name: 'City Supermarket', address: '12 Main Street' },
    { name: 'Farmers Market', address: 'Central Square' },
    { name: "Tom's Butcher", address: '8 Oak Avenue' },
    { name: 'Harbor Fishmonger', address: '3 Dock Road' },
    { name: 'Corner Bakery', address: '21 Baker Lane' },
    { name: 'Wholesale Warehouse', address: 'Industrial Park, Unit 5' },
  ],
  es: [
    { name: 'Supermercado Central', address: 'Calle Mayor, 12' },
    { name: 'Mercado de Agricultores', address: 'Plaza Central' },
    { name: 'Carnicería Tomás', address: 'Avenida del Roble, 8' },
    { name: 'Pescadería del Puerto', address: 'Camino del Muelle, 3' },
    { name: 'Panadería de la Esquina', address: 'Calle del Horno, 21' },
    { name: 'Almacén Mayorista', address: 'Polígono Industrial, Nave 5' },
  ],
};
