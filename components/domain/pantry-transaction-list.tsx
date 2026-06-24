import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import type { PantryTransaction, PantryTransactionType } from '@/lib/db/repositories/pantry';
import { formatDate } from '@/lib/formatting/date';
import { useTranslation } from '@/lib/i18n';

type PantryTransactionListProps = {
  transactions?: PantryTransaction[];
};

const transactionTitleKeys: Record<PantryTransactionType, string> = {
  purchase: 'pantry.purchase',
  add: 'pantry.add',
  remove: 'pantry.remove',
  adjust: 'pantry.adjust',
  waste: 'pantry.waste',
  consume: 'pantry.consume',
};

export function PantryTransactionList({ transactions = [] }: PantryTransactionListProps) {
  const { t } = useTranslation();

  if (transactions.length === 0) {
    return <EmptyState title={t('pantry.transactions')} description={t('common.empty')} />;
  }

  return transactions.map((transaction) => (
    <ListRow
      key={transaction.id}
      title={t(transactionTitleKeys[transaction.type])}
      subtitle={`${transaction.quantity} ${transaction.unit}`}
      meta={formatDate(transaction.occurredAt)}
    />
  ));
}
