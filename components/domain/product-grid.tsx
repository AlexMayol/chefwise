import { type Href } from 'expo-router';
import { View } from 'react-native';

import { GridCard, type CollectionItem } from '@/components/ui/grid-card';
import type { ProductListItem } from '@/lib/db/repositories/products';
import { formatCurrency } from '@/lib/formatting/currency';
import { useTranslation } from '@/lib/i18n';
import { resolveImageUri } from '@/lib/images/storage';
import { chunkGridRows } from '@/lib/ui/grid';

// Maps a product to the same card shape the catalog grid uses, so products render
// identically wherever they appear. `missingPriceLabel` keeps this free of the i18n t type.
export function productToCollectionItem(
  product: ProductListItem,
  missingPriceLabel: string,
  showMarket = true,
): CollectionItem {
  return {
    id: product.id,
    title: `${product.isFavorite ? '★ ' : ''}${product.name}`,
    subtitle: showMarket ? (product.marketName ?? undefined) : undefined,
    meta:
      product.normalizedPrice != null
        ? `${formatCurrency(product.normalizedPrice)}/${product.normalizedUnit}`
        : missingPriceLabel,
    imageUri: resolveImageUri(product.imagePath) ?? undefined,
    emoji: '🥕',
    href: `/products/${product.id}` as Href,
  };
}

// Renders products as the catalog grid card (image/emoji, favorite, market, unit price).
export function ProductGrid({
  products,
  columns = 2,
  showMarket = true,
}: {
  products: ProductListItem[];
  columns?: number;
  showMarket?: boolean;
}) {
  const { t } = useTranslation();
  const rows = chunkGridRows(
    products.map((product) => productToCollectionItem(product, t('common.missingPrice'), showMarket)),
    columns,
  );

  return (
    <View className="gap-3">
      {rows.map((row, rowIndex) => (
        <View key={row.map((item) => item.id).join('-') || rowIndex} className="flex-row gap-3">
          {row.map((item) => (
            <GridCard key={item.id} item={item} />
          ))}
          {Array.from({ length: columns - row.length }).map((_, index) => (
            <View key={`spacer-${index}`} className="flex-1" />
          ))}
        </View>
      ))}
    </View>
  );
}
