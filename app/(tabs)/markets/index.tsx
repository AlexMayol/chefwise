import { CollectionScreen } from '@/components/domain/collection-screen';
import { MarketForm } from '@/components/domain/market-form';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useTranslation } from '@/lib/i18n';
import type { Href } from 'expo-router';

export default function MarketsScreen() {
  const { t } = useTranslation();
  const { items, create } = useMarkets();

  return (
    <CollectionScreen
      title={t('navigation.markets')}
      description={t('forms.address')}
      addLabel={t('actions.add')}
      modalTitle={t('navigation.markets')}
      items={items.map((market) => ({
        id: market.id,
        title: market.name,
        subtitle: market.address ?? undefined,
        href: `/markets/${market.id}` as Href,
      }))}
      renderForm={(onSaved) => (
        <MarketForm
          onSubmit={async (values) => {
            await create(values);
            onSaved();
          }}
        />
      )}
    />
  );
}
