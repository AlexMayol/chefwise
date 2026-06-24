import { CollectionScreen } from '@/components/domain/collection-screen';
import { ShoppingListForm } from '@/components/domain/shopping-list-form';
import { useShoppingLists } from '@/lib/hooks/use-shopping-lists';
import { useTranslation } from '@/lib/i18n';
import type { Href } from 'expo-router';

export default function ShoppingScreen() {
  const { t } = useTranslation();
  const { items, create } = useShoppingLists();

  return (
    <CollectionScreen
      title={t('shopping.title')}
      description={`${t('shopping.draft')} · ${t('shopping.active')} · ${t('shopping.completed')}`}
      addLabel={t('shopping.new')}
      modalTitle={t('shopping.new')}
      items={items.map((list) => ({
        id: list.id,
        title: list.name,
        meta: t(`shopping.${list.status}`),
        href: `/shopping/${list.id}` as Href,
      }))}
      renderForm={(onSaved) => (
        <ShoppingListForm
          onSubmit={async (values) => {
            await create(values);
            onSaved();
          }}
        />
      )}
    />
  );
}
