import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { DeleteButton } from '@/components/domain/delete-button';
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
  const { item: product, update, remove } = useProductDetail(productId);
  const { items, latest, create } = useProductPrices(productId);
  const { items: markets } = useMarkets();
  const market = product ? markets.find((entry) => entry.id === product.marketId) : undefined;

  return (
    <FeatureScreen
      title={product?.name ?? t('products.title')}
      description={latest ? `${t('products.latestPrice')}: ${formatCurrency(latest.price)}` : t('common.missingPrice')}
      emoji="🥕"
      showBack
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
        <Text className="text-lg font-semibold text-card-foreground">{t('forms.market')}</Text>
        {market ? (
          <ListRow title={market.name} subtitle={market.address ?? undefined} />
        ) : (
          <Text className="text-sm text-muted-foreground">{t('common.empty')}</Text>
        )}
      </View>
      <PriceForm
        productId={productId}
        onSubmit={async (values) => {
          await create(values);
        }}
      />
      <PriceHistoryList prices={items} />
      <DeleteButton onDelete={remove} />
    </FeatureScreen>
  );
}
