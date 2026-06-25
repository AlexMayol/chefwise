import { useRouter } from 'expo-router';

import { FeatureScreen } from '@/components/domain/feature-screen';
import { MarketForm } from '@/components/domain/market-form';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useTranslation } from '@/lib/i18n';

export default function NewMarketScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { create } = useMarkets();

  return (
    <FeatureScreen title={t('navigation.markets')} emoji="🏪" showBack>
      <MarketForm
        onSubmit={async (values) => {
          await create(values);
          router.back();
        }}
      />
    </FeatureScreen>
  );
}
