import { Link, useFocusEffect, type Href } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategorySection } from '@/components/domain/category-section';
import { ProductRow, type ProductRowItem } from '@/components/domain/product-row';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FormField } from '@/components/ui/form-field';
import { LoadingState } from '@/components/ui/loading-state';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { SearchBar } from '@/components/ui/search-bar';
import { Select } from '@/components/ui/select';
import { SelectInput } from '@/components/ui/select-input';
import { useColorScheme } from '@/components/useColorScheme';
import type { ProductSort } from '@/lib/db/repositories/products';
import { formatCurrency } from '@/lib/formatting/currency';
import { useCategories } from '@/lib/hooks/use-categories';
import { useProducts } from '@/lib/hooks/use-products';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';
import { getDesignTokens } from '@/lib/theme/tokens';
import { categoryEmoji, productEmoji } from '@/lib/ui/category-emoji';

type MinimumRatingFilter = 'none' | '1' | '2' | '3' | '4' | '5';
const OTHER_KEY = '__other__';

export default function ProductsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tokens = getDesignTokens(useColorScheme());
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [minimumRating, setMinimumRating] = useState<MinimumRatingFilter>('none');
  const [sort, setSort] = useState<ProductSort>('name');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { items, loading, reload } = useProducts({
    favoritesOnly,
    minRating: minimumRating === 'none' ? undefined : Number(minimumRating),
    sort,
  });
  const { items: categories } = useCategories();

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((category) => [category.id, category.name]));
    return (id: string | null) => (id ? map.get(id) ?? null : null);
  }, [categories]);

  const activeFilterCount = (favoritesOnly ? 1 : 0) + (minimumRating !== 'none' ? 1 : 0) + (sort !== 'name' ? 1 : 0);

  // Filter by search + chosen category, then group the rows by category.
  const sections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const groups = new Map<string, { key: string; name: string; emoji: string; rows: ProductRowItem[] }>();

    for (const product of items) {
      if (normalizedQuery && !product.name.toLowerCase().includes(normalizedQuery)) continue;
      const key = product.categoryId ?? OTHER_KEY;
      if (categoryFilter !== 'all' && key !== categoryFilter) continue;

      if (!groups.has(key)) {
        const name = categoryName(product.categoryId);
        groups.set(key, {
          key,
          name: name ?? t('products.otherCategory'),
          emoji: categoryEmoji(name),
          rows: [],
        });
      }

      const best = product.bestNormalizedPrice;
      const hasPrice = best != null;
      groups.get(key)!.rows.push({
        id: product.id,
        name: product.name,
        imageUri: resolveEntityImageUri(product.imagePath) ?? undefined,
        emoji: productEmoji(product.categoryId, categories),
        rating: product.rating,
        hasPrice,
        priceLabel: hasPrice ? t('common.fromPrice', { price: formatCurrency(best) }) : t('common.noPriceYet'),
        isFavorite: product.isFavorite,
        href: `/products/${product.id}` as Href,
      });
    }

    return [...groups.values()].sort((a, b) => {
      if (a.key === OTHER_KEY) return 1;
      if (b.key === OTHER_KEY) return -1;
      return a.name.localeCompare(b.name);
    });
  }, [items, query, categoryFilter, categoryName, categories, t]);

  const categoryOptions = useMemo(
    () => [
      { label: t('products.allCategories'), value: 'all' },
      ...categories.map((category) => ({ label: category.name, value: category.id })),
    ],
    [categories, t],
  );

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <Text className="text-3xl font-bold tracking-tight text-foreground">{t('products.title')}</Text>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t('products.searchPlaceholder')}
          onFilter={() => setFiltersOpen(true)}
          filterActive={activeFilterCount > 0}
          filterLabel={t('common.filters')}
        />

        <SelectInput
          value={categoryFilter}
          options={categoryOptions}
          onChange={setCategoryFilter}
          placeholder={t('products.allCategories')}
        />

        {loading && items.length === 0 ? (
          <LoadingState />
        ) : sections.length === 0 ? (
          <EmptyState title={t('common.empty')} />
        ) : (
          sections.map((section) => (
            <CategorySection key={section.key} title={section.name} emoji={section.emoji} count={section.rows.length}>
              {section.rows.map((row, index) => (
                <ProductRow key={row.id} item={row} separator={index > 0} />
              ))}
            </CategorySection>
          ))
        )}
      </ScreenScaffold>

      <BottomActionBar>
        <Link href="/products/new" asChild>
          <Button label={t('products.new')} icon={<Plus size={18} color={tokens.primaryForeground} />} />
        </Link>
      </BottomActionBar>

      <BottomSheet visible={filtersOpen} onClose={() => setFiltersOpen(false)} bottomInset={insets.bottom}>
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-foreground">{t('common.filters')}</Text>
            <View className="flex-row items-center gap-1">
              <Button
                label={t('actions.reset')}
                variant="ghost"
                size="sm"
                disabled={activeFilterCount === 0}
                onPress={() => {
                  setFavoritesOnly(false);
                  setMinimumRating('none');
                  setSort('name');
                }}
              />
              <Button label={t('actions.done')} variant="ghost" size="sm" onPress={() => setFiltersOpen(false)} />
            </View>
          </View>
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
      </BottomSheet>
    </View>
  );
}
