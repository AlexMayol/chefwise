import { type Href } from 'expo-router';
import { View } from 'react-native';

import { GridCard, type CollectionItem } from '@/components/ui/grid-card';
import type { ProductListItem } from '@/lib/db/repositories/products';
import { formatCurrency } from '@/lib/formatting/currency';
import { useCategories } from '@/lib/hooks/use-categories';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';
import { productEmoji } from '@/lib/ui/category-emoji';
import { chunkGridRows } from '@/lib/ui/grid';

// Maps a product to the same card shape the catalog grid uses, so products render
// identically wherever they appear. `missingPriceLabel` keeps this free of the i18n t type.
export function productToCollectionItem(product: ProductListItem, missingPriceLabel: string, emoji: string): CollectionItem {
  return {
    id: product.id,
    title: `${product.isFavorite ? '★ ' : ''}${product.name}`,
    meta:
      product.bestNormalizedPrice != null
        ? `${formatCurrency(product.bestNormalizedPrice)}/${product.bestNormalizedUnit}`
        : missingPriceLabel,
    imageUri: resolveEntityImageUri(product.imagePath) ?? undefined,
    emoji,
    href: `/products/${product.id}` as Href,
  };
}

// Renders products as the catalog grid card (image/emoji, favorite, cheapest unit price).
export function ProductGrid({
  products,
  columns = 2,
  selectedIds,
  onToggleSelect,
}: {
  products: ProductListItem[];
  columns?: number;
  // When onToggleSelect is provided the grid renders as selectable checkboxes.
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}) {
  const { t } = useTranslation();
  const { items: categories } = useCategories();
  const rows = chunkGridRows(
    products.map((product) =>
      productToCollectionItem(product, t('common.missingPrice'), productEmoji(product.categoryId, categories)),
    ),
    columns,
  );

  return (
    <View className="gap-3">
      {rows.map((row, rowIndex) => (
        <View key={row.map((item) => item.id).join('-') || rowIndex} className="flex-row gap-3">
          {row.map((item) =>
            onToggleSelect ? (
              <GridCard
                key={item.id}
                item={{ ...item, href: undefined }}
                selected={selectedIds?.has(item.id) ?? false}
                onPress={() => onToggleSelect(item.id)}
              />
            ) : (
              <GridCard key={item.id} item={item} />
            ),
          )}
          {Array.from({ length: columns - row.length }).map((_, index) => (
            <View key={`spacer-${index}`} className="flex-1" />
          ))}
        </View>
      ))}
    </View>
  );
}
