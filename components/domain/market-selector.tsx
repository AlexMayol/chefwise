import { Text } from 'react-native';

import { Select } from '@/components/ui/select';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useTranslation } from '@/lib/i18n';

type MarketSelectorProps = {
  value?: string;
  onChange(marketId: string): void;
};

export function MarketSelector({ value, onChange }: MarketSelectorProps) {
  const { t } = useTranslation();
  const { items } = useMarkets();

  if (items.length === 0) {
    return <Text className="text-sm text-muted-foreground">{t('common.empty')}</Text>;
  }

  return <Select value={value} onChange={onChange} options={items.map((market) => ({ label: market.name, value: market.id }))} />;
}
