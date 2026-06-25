import { FeatureScreen } from '@/components/domain/feature-screen';
import { MarketForm } from '@/components/domain/market-form';
import { useCreateAndNavigateBack } from '@/lib/hooks/use-create-and-back';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useTranslation } from '@/lib/i18n';

export default function NewMarketScreen() {
  const { t } = useTranslation();
  const { create } = useMarkets();

  return (
    <FeatureScreen title={t('navigation.markets')} emoji="🏪" showBack>
      <MarketForm onSubmit={useCreateAndNavigateBack(create)} />
    </FeatureScreen>
  );
}
