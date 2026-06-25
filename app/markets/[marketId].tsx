import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddProductsSheet } from '@/components/domain/add-products-sheet';
import { MarketForm } from '@/components/domain/market-form';
import { ProductGrid } from '@/components/domain/product-grid';
import { BackButton } from '@/components/ui/back-button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { EditButton } from '@/components/ui/edit-button';
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
  const { items: products, assign } = useProducts();
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);

  const market = items.find((item) => item.id === marketId);
  const linkedProducts = products.filter((product) => product.marketId === marketId);
  const candidates = products.filter((product) => product.marketId !== marketId);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ gap: 16, paddingTop: insets.top + 16, paddingBottom: 16, paddingHorizontal: 20 }}>
      <View className="gap-2">
        <View className="flex-row items-center gap-3">
          <BackButton />
          <Text className="text-3xl">🏪</Text>
          <Text className="flex-1 text-3xl font-bold tracking-tight text-foreground">{market?.name ?? t('navigation.markets')}</Text>
          <EditButton onPress={() => setEditing(true)} />
        </View>
        {market?.address ? <Text className="text-base text-muted-foreground">{market.address}</Text> : null}
      </View>

      <Text className="text-lg font-semibold text-card-foreground">{t('navigation.products')}</Text>
      <View className="flex-row gap-2">
        <Button
          className="flex-1"
          size="sm"
          variant="secondary"
          label={t('products.new')}
          onPress={() => router.push({ pathname: '/products/new', params: { marketId } })}
        />
        <Button
          className="flex-1"
          size="sm"
          variant="secondary"
          label={t('products.addExisting')}
          onPress={() => setAdding(true)}
        />
      </View>
      {linkedProducts.length > 0 ? (
        <ProductGrid products={linkedProducts} showMarket={false} />
      ) : (
        <EmptyState title={t('common.empty')} />
      )}

      <AddProductsSheet
        visible={adding}
        onClose={() => setAdding(false)}
        products={candidates}
        bottomInset={insets.bottom}
        onAdd={(ids) => assign(ids, { marketId })}
      />

      <BottomSheet visible={editing} onClose={() => setEditing(false)} bottomInset={insets.bottom}>
        {market ? (
          <ScrollView style={{ maxHeight: 480 }} keyboardShouldPersistTaps="handled">
            <MarketForm
              initialValues={market}
              onSubmit={async (values) => {
                await update(marketId, values);
                setEditing(false);
              }}
              onDelete={async () => {
                await remove(marketId);
                router.back();
              }}
            />
          </ScrollView>
        ) : null}
      </BottomSheet>
    </ScrollView>
  );
}
