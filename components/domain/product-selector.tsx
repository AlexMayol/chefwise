import { Text } from 'react-native';

import { Select } from '@/components/ui/select';
import { useProducts } from '@/lib/hooks/use-products';
import { useTranslation } from '@/lib/i18n';

type ProductSelectorProps = {
  value?: string;
  onChange(productId: string): void;
};

export function ProductSelector({ value, onChange }: ProductSelectorProps) {
  const { t } = useTranslation();
  const { items } = useProducts({ sort: 'favorites_first' });

  if (items.length === 0) {
    return <Text className="text-sm text-muted-foreground">{t('common.empty')}</Text>;
  }

  return <Select value={value} onChange={onChange} options={items.map((product) => ({ label: product.name, value: product.id }))} />;
}
