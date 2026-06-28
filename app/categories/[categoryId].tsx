import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { MoreVertical } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddProductsSheet } from '@/components/domain/add-products-sheet';
import { CategoryForm, type CategoryFormHandle } from '@/components/domain/category-form';
import { DeleteButton } from '@/components/domain/delete-button';
import { ProductRow, type ProductRowItem } from '@/components/domain/product-row';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DetailHeader } from '@/components/ui/detail-header';
import { EditButton } from '@/components/ui/edit-button';
import { EmptyState } from '@/components/ui/empty-state';
import { EntityAvatar } from '@/components/ui/entity-avatar';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { IconButton } from '@/components/ui/icon-button';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { SearchBar } from '@/components/ui/search-bar';

import { bestMarketByProduct } from '@/lib/domain/category-insights';
import { formatCurrency } from '@/lib/formatting/currency';
import { useCategories } from '@/lib/hooks/use-categories';
import { useCategoryInsights } from '@/lib/hooks/use-category-insights';
import { useProducts } from '@/lib/hooks/use-products';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { categoryEmoji } from '@/lib/ui/category-emoji';

export default function CategoryDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useDesignTokens();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { items: categories, update, remove } = useCategories();
  const { items: products, assign, reload } = useProducts();
  const { item: priceEvents, reload: reloadEvents } = useCategoryInsights(categoryId);

  const [editing, setEditing] = useState(false);
  const editFormRef = useRef<CategoryFormHandle>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState('');

  useReloadOnFocus(reload);
  useReloadOnFocus(reloadEvents);

  const category = categories.find((item) => item.id === categoryId);
  const linkedProducts = useMemo(
    () => products.filter((product) => product.categoryId === categoryId),
    [products, categoryId],
  );
  const linkedProductIds = useMemo(() => new Set(linkedProducts.map((p) => p.id)), [linkedProducts]);
  const bestMarket = useMemo(() => bestMarketByProduct(priceEvents), [priceEvents]);

  const toCategoryRow = (product: (typeof linkedProducts)[number]): ProductRowItem => {
    const hasPrice = product.bestNormalizedPrice != null;
    return {
      id: product.id,
      name: product.name,
      imageUri: resolveEntityImageUri(product.bestImagePath) ?? undefined,
      emoji: category?.description || '🥕',
      subtitle: t('categories.offerCount', { count: product.offerCount }),
      hasPrice,
      priceLabel: hasPrice
        ? `${formatCurrency(product.bestNormalizedPrice!)} / ${product.bestNormalizedUnit}`
        : t('common.noPriceYet'),
      priceMeta: bestMarket.get(product.id)?.marketName ?? undefined,
      isFavorite: product.isFavorite,
      href: `/products/${product.id}` as Href,
    };
  };

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = term ? linkedProducts.filter((product) => product.name.toLowerCase().includes(term)) : linkedProducts;
    return matches.map(toCategoryRow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedProducts, query, bestMarket, category?.description, t]);

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <DetailHeader>
          <EditButton onPress={() => setEditing(true)} />
          <IconButton accessibilityLabel={t('actions.more')} onPress={() => setMenuOpen(true)}>
            <MoreVertical size={20} color={tokens.foreground} />
          </IconButton>
        </DetailHeader>

        <View className="flex-row items-center gap-4">
          <EntityAvatar emoji={category?.description || categoryEmoji(category?.name)} size={80} circle />
          <View className="flex-1 gap-1">
            <Text className="text-2xl font-bold tracking-tight text-foreground">
              {category?.name ?? t('categories.title')}
            </Text>
            <Text className="text-base text-muted-foreground">
              {t('categories.productCount', { count: linkedProducts.length })}
            </Text>
          </View>
        </View>

        <View className="gap-3">
          {linkedProducts.length > 0 ? (
            <SearchBar value={query} onChangeText={setQuery} placeholder={t('products.searchPlaceholder')} />
          ) : null}
          {filteredProducts.length > 0 ? (
            <Card className="gap-0 px-4 py-1">
              {filteredProducts.map((row, index) => (
                <ProductRow key={row.id} item={row} separator={index > 0} />
              ))}
            </Card>
          ) : (
            <EmptyState title={t('common.empty')} />
          )}
        </View>
      </ScreenScaffold>

      <BottomActionBar withSafeArea>
        <View className="flex-row gap-3">
          <Button className="flex-1" label={t('products.addProduct')} onPress={() => setAdding(true)} />
          <Button
            className="flex-1"
            variant="ghost"
            label={t('products.createProduct')}
            onPress={() => router.push({ pathname: '/products/new', params: { categoryId } })}
          />
        </View>
      </BottomActionBar>

      <AddProductsSheet
        visible={adding}
        onClose={() => setAdding(false)}
        products={products}
        initialSelectedIds={linkedProductIds}
        bottomInset={insets.bottom}
        onAdd={(ids) => assign(ids, { categoryId })}
        onRemove={(ids) => assign(ids, { categoryId: null })}
      />

      <BottomSheet visible={editing} onClose={() => setEditing(false)} bottomInset={insets.bottom}>
        {category ? (
          <View className="flex-1 gap-4">
            <FormScreenHeader
              title={t('categories.edit')}
              onCancel={() => setEditing(false)}
              onSave={() => editFormRef.current?.submit()}
            />
            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
              <CategoryForm
                ref={editFormRef}
                initialValues={{ name: category.name, description: category.description }}
                hideSubmit
                onSubmit={async (values) => {
                  await update(categoryId, values);
                  setEditing(false);
                }}
              />
            </ScrollView>
          </View>
        ) : null}
      </BottomSheet>

      <BottomSheet visible={menuOpen} onClose={() => setMenuOpen(false)} bottomInset={insets.bottom} resizable={false}>
        <View className="gap-3">
          <Pressable
            className="rounded-xl px-4 py-3 active:opacity-70"
            onPress={() => {
              setMenuOpen(false);
              setEditing(true);
            }}>
            <Text className="text-base font-semibold text-foreground">{t('actions.edit')}</Text>
          </Pressable>
          <DeleteButton onDelete={() => remove(categoryId)} />
        </View>
      </BottomSheet>
    </View>
  );
}
