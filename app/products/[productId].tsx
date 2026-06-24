import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { FeatureScreen } from '@/components/domain/feature-screen';
import { PriceForm } from '@/components/domain/price-form';
import { PriceHistoryList } from '@/components/domain/price-history-list';
import { ProductForm } from '@/components/domain/product-form';
import { ListRow } from '@/components/ui/list-row';
import { formatCurrency } from '@/lib/formatting/currency';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useProductPrices } from '@/lib/hooks/use-product-prices';
import { useProductDetail } from '@/lib/hooks/use-products';
import { useTranslation } from '@/lib/i18n';

export default function ProductDetailScreen() {
  const { t } = useTranslation();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { item: product, update } = useProductDetail(productId);
  const { items, latest, create } = useProductPrices(productId);
  const { items: markets } = useMarkets();
  const marketsById = new Map(markets.map((market) => [market.id, market]));
  const marketsWithPrices = Array.from(new Set(items.map((price) => price.marketId))).map((marketId) => ({
    id: marketId,
    name: marketsById.get(marketId)?.name ?? marketId,
    address: marketsById.get(marketId)?.address ?? undefined,
  }));

  return (
    <FeatureScreen
      title={product?.name ?? t('products.title')}
      description={latest ? `${t('products.latestPrice')}: ${formatCurrency(latest.price)}` : t('common.missingPrice')}
    >
      {product ? (
        <ProductForm
          initialValues={product}
          onSubmit={async (values) => {
            await update(values);
          }}
        />
      ) : null}
      <View className="gap-2">
        <Text className="text-lg font-semibold text-card-foreground">{t('products.marketsWithPrices')}</Text>
        {marketsWithPrices.length > 0 ? (
          marketsWithPrices.map((market) => <ListRow key={market.id} title={market.name} subtitle={market.address} />)
        ) : (
          <Text className="text-sm text-muted-foreground">{t('common.empty')}</Text>
        )}
      </View>
      <PriceForm
        productId={productId}
        markets={markets}
        onSubmit={async (values) => {
          await create(values);
        }}
      />
      <PriceHistoryList prices={items} />
    </FeatureScreen>
  );
}
