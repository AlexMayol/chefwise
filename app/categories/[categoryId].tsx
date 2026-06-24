import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryForm } from '@/components/domain/category-form';
import { ProductGrid } from '@/components/domain/product-grid';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useCategories } from '@/lib/hooks/use-categories';
import { useProducts } from '@/lib/hooks/use-products';
import { useTranslation } from '@/lib/i18n';

export default function CategoryDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { items, update, remove } = useCategories();
  const { items: products } = useProducts();
  const [editing, setEditing] = useState(false);

  const category = items.find((item) => item.id === categoryId);
  const linkedProducts = products.filter((product) => product.categoryId === categoryId);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 16, paddingHorizontal: 20 }}>
      <View className="flex-row items-center gap-3">
        <Pressable onPress={() => router.back()} hitSlop={8} className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-70">
          <Text className="text-xl font-semibold text-foreground">←</Text>
        </Pressable>
        {category?.description ? <Text className="text-3xl">{category.description}</Text> : null}
        <Text className="flex-1 text-3xl font-bold tracking-tight text-foreground">{category?.name ?? t('categories.title')}</Text>
      </View>

      <Text className="text-lg font-semibold text-card-foreground">{t('navigation.products')}</Text>
      {linkedProducts.length > 0 ? (
        <ProductGrid products={linkedProducts} />
      ) : (
        <EmptyState title={t('common.empty')} />
      )}

      <Button label={t('actions.edit')} variant="secondary" onPress={() => setEditing(true)} />

      <BottomSheet visible={editing} onClose={() => setEditing(false)} bottomInset={insets.bottom}>
        {category ? (
          <ScrollView style={{ maxHeight: 480 }} keyboardShouldPersistTaps="handled">
            <CategoryForm
              initialValues={{ name: category.name, description: category.description }}
              onSubmit={async (values) => {
                await update(categoryId, values);
                setEditing(false);
              }}
              onDelete={async () => {
                await remove(categoryId);
                router.back();
              }}
            />
          </ScrollView>
        ) : null}
      </BottomSheet>
    </ScrollView>
  );
}
