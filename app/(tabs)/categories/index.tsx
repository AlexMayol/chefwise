import { type Href } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryForm, type CategoryFormHandle } from '@/components/domain/category-form';
import { CategoryRow, type CategoryRowItem } from '@/components/domain/category-row';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { EntityActionMenuSheet } from '@/components/ui/entity-action-menu-sheet';
import { EntityEditSheet } from '@/components/ui/entity-edit-sheet';
import { FormField } from '@/components/ui/form-field';
import { ListingContent } from '@/components/ui/listing-content';
import { ListingScreenHeader } from '@/components/ui/listing-screen-header';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { SearchBar } from '@/components/ui/search-bar';
import { Select } from '@/components/ui/select';
import { mostTrackedCategoryId, productCountsByCategory } from '@/lib/domain/category-stats';
import type { Category } from '@/lib/db/repositories/categories';
import { useCategories } from '@/lib/hooks/use-categories';
import { useListingQuickActions } from '@/lib/hooks/use-entity-quick-actions';
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
  const editFormRef = useRef<CategoryFormHandle>(null);
  const actions = useListingQuickActions<Category>();

  const { items: categories, loading, reload, update, remove } = useCategories();
  const { items: products, reload: reloadProducts } = useProducts();

  useReloadOnFocus(reload, reloadProducts);

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

  const newCategoryHref = '/categories/new' as Href;

  const actionSubtitle = useMemo(() => {
    if (!actions.entity) return undefined;
    return t('categories.productCount', { count: counts.get(actions.entity.id) ?? 0 });
  }, [actions.entity, counts, t]);

  function openActions(categoryId: string) {
    const category = categories.find((entry) => entry.id === categoryId);
    if (category) actions.open(category);
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <ListingScreenHeader title={t('categories.title')} newHref={newCategoryHref} newLabel={t('categories.new')} />

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t('categories.searchPlaceholder')}
          onFilter={() => setFiltersOpen(true)}
          filterActive={sort !== 'name'}
          filterLabel={t('common.filters')}
        />

        <ListingContent
          loading={loading}
          sourceEmpty={categories.length === 0}
          itemCount={rows.length}
          query={query}
          newHref={newCategoryHref}
          newLabel={t('categories.new')}
          emptyTitle={t('common.empty')}>
          {rows.map((row) => (
            <CategoryRow
              key={row.id}
              item={row}
              badgeLabel={t('categories.mostTracked')}
              onLongPress={() => openActions(row.id)}
            />
          ))}
        </ListingContent>
      </ScreenScaffold>

      {actions.entity ? (
        <>
          <EntityActionMenuSheet
            visible={actions.menuVisible}
            onClose={actions.close}
            bottomInset={insets.bottom}
            title={actions.entity.name}
            subtitle={actionSubtitle}
            emoji={actions.entity.description || categoryEmoji(actions.entity.name)}
            editLabel={t('categories.edit')}
            deleteError={actions.deleteError}
            onEdit={actions.beginEdit}
            onDelete={() => void actions.remove(remove, actions.entity!.id)}
          />
          <EntityEditSheet
            visible={actions.editVisible}
            onClose={actions.close}
            bottomInset={insets.bottom}
            title={t('categories.edit')}
            onSave={() => editFormRef.current?.submit()}>
            <CategoryForm
              ref={editFormRef}
              initialValues={{ name: actions.entity.name, description: actions.entity.description }}
              hideSubmit
              onSubmit={async (values) => {
                await update(actions.entity!.id, values);
                actions.close();
              }}
            />
          </EntityEditSheet>
        </>
      ) : null}

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
