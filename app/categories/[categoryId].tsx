import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddProductsSheet } from '@/components/domain/add-products-sheet';
import { CategoryForm } from '@/components/domain/category-form';
import { ProductGrid } from '@/components/domain/product-grid';
import { BackButton } from '@/components/ui/back-button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { Button } from '@/components/ui/button';
import { EditButton } from '@/components/ui/edit-button';
import { EmptyState } from '@/components/ui/empty-state';
import { useCategories } from '@/lib/hooks/use-categories';
import { useProducts } from '@/lib/hooks/use-products';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';

export default function CategoryDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { items, update, remove } = useCategories();
  const { items: products, assign, reload } = useProducts();
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);

  useReloadOnFocus(reload);

  const category = items.find((item) => item.id === categoryId);
  const linkedProducts = products.filter((product) => product.categoryId === categoryId);
  const candidates = products.filter((product) => product.categoryId !== categoryId);

  return (
    <ScreenScaffold>
      <View className="flex-row items-center gap-3">
        <BackButton />
        {category?.description ? <Text className="text-3xl">{category.description}</Text> : null}
        <Text className="flex-1 text-3xl font-bold tracking-tight text-foreground">{category?.name ?? t('categories.title')}</Text>
        <EditButton onPress={() => setEditing(true)} />
      </View>

      <Text className="text-lg font-semibold text-card-foreground">{t('navigation.products')}</Text>
      <View className="flex-row gap-2">
        <Button
          className="flex-1"
          size="sm"
          variant="secondary"
          label={t('products.new')}
          onPress={() => router.push({ pathname: '/products/new', params: { categoryId } })}
        />
        <Button
          className="flex-1"
          size="sm"
          variant="secondary"
          label={t('products.addExisting')}
          onPress={() => setAdding(true)}
        />
      </View>
      {linkedProducts.length > 0 ? <ProductGrid products={linkedProducts} /> : <EmptyState title={t('common.empty')} />}

      <AddProductsSheet
        visible={adding}
        onClose={() => setAdding(false)}
        products={candidates}
        bottomInset={insets.bottom}
        onAdd={(ids) => assign(ids, { categoryId })}
      />

      <BottomSheet visible={editing} onClose={() => setEditing(false)} bottomInset={insets.bottom}>
        {category ? (
          <ScrollView style={{ maxHeight: 480 }} keyboardShouldPersistTaps="handled">
            <CategoryForm
              initialValues={{ name: category.name, description: category.description }}
              onSubmit={async (values) => {
                await update(categoryId, values);
                setEditing(false);
              }}
              onDelete={() => remove(categoryId)}
            />
          </ScrollView>
        ) : null}
      </BottomSheet>
    </ScreenScaffold>
  );
}
