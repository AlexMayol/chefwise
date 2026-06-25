import { CollectionScreen } from '@/components/domain/collection-screen';
import { MarketForm } from '@/components/domain/market-form';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';
import { type Href } from 'expo-router';

export default function MarketsScreen() {
  const { t } = useTranslation();
  const { items, loading, create, reload } = useMarkets();

  // Refresh when returning from the edit/detail screen (it uses a separate hook instance).
  useReloadOnFocus(reload);

  return (
    <CollectionScreen
      title={t('navigation.markets')}
      emoji="🏪"
      addLabel={t('markets.new')}
      modalTitle={t('navigation.markets')}
      loading={loading}
      items={items.map((market) => ({
        id: market.id,
        title: market.name,
        subtitle: market.address ?? undefined,
        imageUri: resolveEntityImageUri(market.imagePath) ?? undefined,
        emoji: '🏪',
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
