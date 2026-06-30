import { type Href } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategorySection } from '@/components/domain/category-section';
import { ProductForm, type ProductFormHandle } from '@/components/domain/product-form';
import { ProductRow, type ProductRowItem } from '@/components/domain/product-row';
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
import { SelectInput } from '@/components/ui/select-input';
import type { ProductListItem, ProductSort } from '@/lib/db/repositories/products';
import { formatCurrency } from '@/lib/formatting/currency';
import { useCategories } from '@/lib/hooks/use-categories';
import { useListingQuickActions } from '@/lib/hooks/use-entity-quick-actions';
import { useProducts } from '@/lib/hooks/use-products';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';
import { categoryEmoji, productEmoji } from '@/lib/ui/category-emoji';

const OTHER_KEY = '__other__';

export default function ProductsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<ProductSort>('name');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const editFormRef = useRef<ProductFormHandle>(null);
  const actions = useListingQuickActions<ProductListItem>();

  const { items, loading, reload, update, remove } = useProducts({
    favoritesOnly,
    sort,
  });
  const { items: categories, reload: reloadCategories } = useCategories();

  useReloadOnFocus(reload, reloadCategories);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((category) => [category.id, category.name]));
    return (id: string | null) => (id ? map.get(id) ?? null : null);
  }, [categories]);

  const activeFilterCount = (favoritesOnly ? 1 : 0) + (sort !== 'name' ? 1 : 0);

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
        const category = categories.find((c) => c.id === product.categoryId);
        groups.set(key, {
          key,
          name: name ?? t('products.otherCategory'),
          emoji: category?.description || categoryEmoji(name),
          rows: [],
        });
      }

      const best = product.bestPrice;
      const hasPrice = best != null;
      groups.get(key)!.rows.push({
        id: product.id,
        name: product.name,
        imageUri: resolveEntityImageUri(product.bestImagePath) ?? undefined,
        emoji: productEmoji(product.categoryId, categories),
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
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
        emoji: category.description || categoryEmoji(category.name),
      })),
    ],
    [categories, t],
  );

  const itemCount = useMemo(() => sections.reduce((total, section) => total + section.rows.length, 0), [sections]);
  const newProductHref = '/products/new' as Href;

  const actionSubtitle = useMemo(() => {
    if (!actions.entity) return undefined;
    return sections.flatMap((section) => section.rows).find((entry) => entry.id === actions.entity!.id)?.priceLabel;
  }, [actions.entity, sections]);

  const actionEmoji = useMemo(
    () => (actions.entity ? productEmoji(actions.entity.categoryId, categories) : undefined),
    [actions.entity, categories],
  );

  function openActions(productId: string) {
    const product = items.find((entry) => entry.id === productId);
    if (product) actions.open(product);
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <ListingScreenHeader title={t('products.title')} newHref={newProductHref} newLabel={t('products.new')} />

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

        <ListingContent
          loading={loading}
          sourceEmpty={items.length === 0}
          itemCount={itemCount}
          query={query}
          newHref={newProductHref}
          newLabel={t('products.new')}
          emptyTitle={t('common.empty')}>
          {sections.map((section) => (
            <CategorySection key={section.key} title={section.name} emoji={section.emoji} count={section.rows.length}>
              {section.rows.map((row, index) => (
                <ProductRow key={row.id} item={row} separator={index > 0} onLongPress={() => openActions(row.id)} />
              ))}
            </CategorySection>
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
            imageUri={resolveEntityImageUri(actions.entity.bestImagePath) ?? undefined}
            emoji={actionEmoji}
            editLabel={t('products.edit')}
            deleteError={actions.deleteError}
            onEdit={actions.beginEdit}
            onDelete={() => void actions.remove(remove, actions.entity!.id)}
          />
          <EntityEditSheet
            visible={actions.editVisible}
            onClose={actions.close}
            bottomInset={insets.bottom}
            title={t('products.edit')}
            onSave={() => editFormRef.current?.submit()}>
            <ProductForm
              ref={editFormRef}
              initialValues={actions.entity}
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
            <View className="flex-row items-center gap-1">
              <Button
                label={t('actions.reset')}
                variant="ghost"
                size="sm"
                disabled={activeFilterCount === 0}
                onPress={() => {
                  setFavoritesOnly(false);
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
          <FormField label={t('products.sortBy')}>
            <Select<ProductSort>
              value={sort}
              onChange={setSort}
              options={[
                { label: t('products.sortName'), value: 'name' },
                { label: t('products.sortFavoritesFirst'), value: 'favorites_first' },
              ]}
            />
          </FormField>
        </View>
      </BottomSheet>
    </View>
  );
}
