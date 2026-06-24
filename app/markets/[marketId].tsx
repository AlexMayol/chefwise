import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteButton } from '@/components/domain/delete-button';
import { MarketForm } from '@/components/domain/market-form';
import { ProductGrid } from '@/components/domain/product-grid';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useProducts } from '@/lib/hooks/use-products';
import { useTranslation } from '@/lib/i18n';

export default function MarketDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { marketId } = useLocalSearchParams<{ marketId: string }>();
  const { items, update, remove } = useMarkets();
  const { items: products } = useProducts();
  const [editing, setEditing] = useState(false);

  const market = items.find((item) => item.id === marketId);
  const linkedProducts = products.filter((product) => product.marketId === marketId);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 16, paddingHorizontal: 20 }}>
      <View className="gap-2">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-70">
            <Text className="text-xl font-semibold text-foreground">←</Text>
          </Pressable>
          <Text className="text-3xl">🏪</Text>
          <Text className="flex-1 text-3xl font-bold tracking-tight text-foreground">{market?.name ?? t('navigation.markets')}</Text>
        </View>
        {market?.address ? <Text className="text-base text-muted-foreground">{market.address}</Text> : null}
      </View>

      <Text className="text-lg font-semibold text-card-foreground">{t('navigation.products')}</Text>
      {linkedProducts.length > 0 ? (
        <ProductGrid products={linkedProducts} showMarket={false} />
      ) : (
        <EmptyState title={t('common.empty')} />
      )}

      <Button label={t('actions.edit')} variant="secondary" onPress={() => setEditing(true)} />

      <BottomSheet visible={editing} onClose={() => setEditing(false)} bottomInset={insets.bottom}>
        {market ? (
          <ScrollView style={{ maxHeight: 480 }} keyboardShouldPersistTaps="handled">
            <View className="gap-4">
              <MarketForm
                initialValues={market}
                onSubmit={async (values) => {
                  await update(marketId, values);
                  setEditing(false);
                }}
              />
              <DeleteButton onDelete={() => remove(marketId)} />
            </View>
          </ScrollView>
        ) : null}
      </BottomSheet>
    </ScrollView>
  );
}
