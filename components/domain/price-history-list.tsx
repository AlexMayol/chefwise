import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { formatCurrency } from '@/lib/formatting/currency';
import { formatDate } from '@/lib/formatting/date';
import { useTranslation } from '@/lib/i18n';

type PriceHistoryListProps = {
  prices?: Array<{ id: string; price: number; quantity: number; unit: string; observedAt: string }>;
};

export function PriceHistoryList({ prices = [] }: PriceHistoryListProps) {
  const { t } = useTranslation();

  if (prices.length === 0) {
    return <EmptyState title={t('products.priceHistory')} description={t('common.empty')} />;
  }

  return prices.map((price) => (
    <ListRow
      key={price.id}
      title={formatCurrency(price.price)}
      subtitle={`${price.quantity} ${price.unit}`}
      meta={formatDate(price.observedAt)}
    />
  ));
}
