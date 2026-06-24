import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import { FeatureScreen } from '@/components/domain/feature-screen';
import { MarketForm } from '@/components/domain/market-form';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useTranslation } from '@/lib/i18n';

export default function MarketDetailScreen() {
  const { t } = useTranslation();
  const { marketId } = useLocalSearchParams<{ marketId: string }>();
  const { update } = useMarkets();

  return (
    <FeatureScreen title={t('navigation.markets')} description={t('errors.deleteBlocked')}>
      <MarketForm onSubmit={(values) => update(marketId, values)} />
      <Text className="text-sm text-muted-foreground">{t('products.marketsWithPrices')}</Text>
    </FeatureScreen>
  );
}
