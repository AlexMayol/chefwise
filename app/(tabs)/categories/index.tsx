import { Link, type Href } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryRow, type CategoryRowItem } from '@/components/domain/category-row';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FormField } from '@/components/ui/form-field';
import { LoadingState } from '@/components/ui/loading-state';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { SearchBar } from '@/components/ui/search-bar';
import { Select } from '@/components/ui/select';
import { mostTrackedCategoryId, productCountsByCategory } from '@/lib/domain/category-stats';
import { useCategories } from '@/lib/hooks/use-categories';
import { useProducts } from '@/lib/hooks/use-products';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { categoryEmoji } from '@/lib/ui/category-emoji';

type CategorySort = 'name' | 'most_products';

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<CategorySort>('name');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { items: categories, loading, reload } = useCategories();
  const { items: products, reload: reloadProducts } = useProducts();

  useReloadOnFocus(
    useCallback(async () => {
      await Promise.all([reload(), reloadProducts()]);
    }, [reload, reloadProducts]),
  );

  const counts = useMemo(() => productCountsByCategory(products), [products]);
  const mostTrackedId = useMemo(() => mostTrackedCategoryId(products), [products]);

  const rows = useMemo<CategoryRowItem[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = categories.filter((category) => !normalizedQuery || category.name.toLowerCase().includes(normalizedQuery));
    const sorted = [...filtered].sort((a, b) =>
      sort === 'most_products'
        ? (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0) || a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name),
    );
    return sorted.map((category) => ({
      id: category.id,
      name: category.name,
      emoji: category.description || categoryEmoji(category.name),
      subtitle: t('categories.productCount', { count: counts.get(category.id) ?? 0 }),
      mostTracked: category.id === mostTrackedId,
      href: `/categories/${category.id}` as Href,
    }));
  }, [categories, query, sort, counts, mostTrackedId, t]);

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <Text className="text-3xl font-bold tracking-tight text-foreground">{t('categories.title')}</Text>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t('categories.searchPlaceholder')}
          onFilter={() => setFiltersOpen(true)}
          filterActive={sort !== 'name'}
          filterLabel={t('common.filters')}
        />

        {loading && categories.length === 0 ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <EmptyState title={t('common.empty')} />
        ) : (
          <View className="gap-3">
            {rows.map((row) => (
              <CategoryRow key={row.id} item={row} badgeLabel={t('categories.mostTracked')} />
            ))}
          </View>
        )}
      </ScreenScaffold>

      <BottomActionBar>
        <Link href="/categories/new" asChild>
          <Button label={t('categories.new')} icon={<Plus size={18} />} />
        </Link>
      </BottomActionBar>

      <BottomSheet visible={filtersOpen} onClose={() => setFiltersOpen(false)} bottomInset={insets.bottom} resizable={false}>
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-foreground">{t('common.filters')}</Text>
            <Button label={t('actions.done')} variant="ghost" size="sm" onPress={() => setFiltersOpen(false)} />
          </View>
          <FormField label={t('products.sortBy')}>
            <Select<CategorySort>
              value={sort}
              onChange={setSort}
              options={[
                { label: t('products.sortName'), value: 'name' },
                { label: t('categories.mostTracked'), value: 'most_products' },
              ]}
            />
          </FormField>
        </View>
      </BottomSheet>
    </View>
  );
}
