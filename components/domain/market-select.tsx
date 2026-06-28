import { CreatableSelect } from '@/components/ui/creatable-select';
import { useMarkets } from '@/lib/hooks/use-markets';
import { resolveEntityImageUri } from '@/lib/images/storage';
import { useTranslation } from '@/lib/i18n';

import { MarketForm } from './market-form';

type MarketSelectProps = {
  value?: string;
  onChange(value: string): void;
};

// Market picker with an inline "create market" drawer.
export function MarketSelect({ value, onChange }: MarketSelectProps) {
  const { t } = useTranslation();
  const { items: markets, create } = useMarkets();

  return (
    <CreatableSelect
      value={value}
      onChange={onChange}
      options={markets.map((market) => ({
        label: market.name,
        value: market.id,
        imageUri: resolveEntityImageUri(market.imagePath) ?? undefined,
        emoji: '🛒',
      }))}
      addLabel={t('markets.new')}
      emptyLabel={t('products.noMarkets')}
      renderCreateForm={(onCreated, formRef) => (
        <MarketForm
          ref={formRef}
          hideSubmit
          onSubmit={async (values) => {
            const market = await create(values);
            onCreated(market.id);
          }}
        />
      )}
    />
  );
}
