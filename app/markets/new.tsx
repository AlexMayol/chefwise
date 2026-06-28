import { useRouter } from 'expo-router';
import { useRef } from 'react';

import { MarketForm, type MarketFormHandle } from '@/components/domain/market-form';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { TipCard } from '@/components/ui/tip-card';
import { useCreateAndNavigateBack } from '@/lib/hooks/use-create-and-back';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useTranslation } from '@/lib/i18n';

export default function NewMarketScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { create } = useMarkets();
  const submit = useCreateAndNavigateBack(create);
  const formRef = useRef<MarketFormHandle>(null);

  return (
    <ScreenScaffold paddingBottom={32}>
      <FormScreenHeader
        title={t('markets.new')}
        onCancel={() => router.back()}
        onSave={() => formRef.current?.submit()}
      />

      <MarketForm ref={formRef} hideSubmit onSubmit={submit} />

      <TipCard title={t('common.tips')}>{t('markets.tip')}</TipCard>
    </ScreenScaffold>
  );
}
