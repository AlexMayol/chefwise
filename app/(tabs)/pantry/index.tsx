import { CollectionScreen } from '@/components/domain/collection-screen';
import { PantryAdjustmentForm } from '@/components/domain/pantry-adjustment-form';
import { PantryTransactionList } from '@/components/domain/pantry-transaction-list';
import { usePantry } from '@/lib/hooks/use-pantry';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';

export default function PantryScreen() {
  const { t } = useTranslation();
  const { items, transactions, loading, adjust, reload } = usePantry();

  useReloadOnFocus(reload);

  return (
    <CollectionScreen
      title={t('pantry.title')}
      emoji="🥫"
      addLabel={t('pantry.add')}
      modalTitle={t('pantry.add')}
      loading={loading}
      items={items.map((item) => ({
        id: item.id,
        title: item.productId,
        subtitle: `${item.quantity} ${item.unit}`,
      }))}
      renderForm={(onSaved, _item, formRef) => (
        <PantryAdjustmentForm
          ref={formRef}
          hideSubmit
          onSubmit={async (values) => {
            await adjust(values);
            onSaved();
          }}
        />
      )}
      footer={<PantryTransactionList transactions={transactions} />}
    />
  );
}
