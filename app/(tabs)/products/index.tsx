import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { CollectionScreen } from '@/components/domain/collection-screen';
import { ProductForm } from '@/components/domain/product-form';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import type { ProductSort } from '@/lib/db/repositories/products';
import { formatCurrency } from '@/lib/formatting/currency';
import { resolveEntityImageUri } from '@/lib/images/storage';
import { useProducts } from '@/lib/hooks/use-products';
import { useTranslation } from '@/lib/i18n';
import { useFocusEffect, type Href } from 'expo-router';

type MinimumRatingFilter = 'none' | '1' | '2' | '3' | '4' | '5';

export default function ProductsScreen() {
  const { t } = useTranslation();
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [minimumRating, setMinimumRating] = useState<MinimumRatingFilter>('none');
  const [sort, setSort] = useState<ProductSort>('name');
  const { items, loading, create, reload, removeMany } = useProducts({
    favoritesOnly,
    minRating: minimumRating === 'none' ? undefined : Number(minimumRating),
    sort,
  });

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  return (
    <CollectionScreen
      title={t('products.title')}
      emoji="🥕"
      addLabel={t('products.new')}
      modalTitle={t('products.new')}
      columns={2}
      loading={loading}
      onDeleteSelected={removeMany}
      items={items.map((product) => ({
        id: product.id,
        title: `${product.isFavorite ? '★ ' : ''}${product.name}`,
        subtitle: product.marketName ?? undefined,
        meta:
          product.normalizedPrice != null
            ? `${formatCurrency(product.normalizedPrice)}/${product.normalizedUnit}`
            : t('common.missingPrice'),
        imageUri: resolveEntityImageUri(product.imagePath) ?? undefined,
        emoji: '🥕',
        href: `/products/${product.id}` as Href,
      }))}
      activeFilterCount={(favoritesOnly ? 1 : 0) + (minimumRating !== 'none' ? 1 : 0) + (sort !== 'name' ? 1 : 0)}
      onResetFilters={() => {
        setFavoritesOnly(false);
        setMinimumRating('none');
        setSort('name');
      }}
      controls={
        <View className="gap-3">
          <Button
            label={t('products.favoritesOnly')}
            variant={favoritesOnly ? 'secondary' : 'ghost'}
            onPress={() => setFavoritesOnly((current) => !current)}
          />
          <FormField label={t('products.minimumRating')}>
            <Select<MinimumRatingFilter>
              value={minimumRating}
              onChange={setMinimumRating}
              options={[
                { label: t('products.anyRating'), value: 'none' },
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
              ]}
            />
          </FormField>
          <FormField label={t('products.sortBy')}>
            <Select<ProductSort>
              value={sort}
              onChange={setSort}
              options={[
                { label: t('products.sortName'), value: 'name' },
                { label: t('products.sortHighestRated'), value: 'highest_rated' },
                { label: t('products.sortLowestRated'), value: 'lowest_rated' },
                { label: t('products.sortFavoritesFirst'), value: 'favorites_first' },
              ]}
            />
          </FormField>
        </View>
      }
      renderForm={(onSaved) => (
        <ProductForm
          onSubmit={async (values, initialPrice) => {
            await create(values, initialPrice);
            onSaved();
          }}
        />
      )}
    />
  );
}
