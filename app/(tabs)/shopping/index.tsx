import { CollectionScreen } from '@/components/domain/collection-screen';
import { ShoppingListForm } from '@/components/domain/shopping-list-form';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useShoppingLists } from '@/lib/hooks/use-shopping-lists';
import { useTranslation } from '@/lib/i18n';
import { type Href } from 'expo-router';

export default function ShoppingScreen() {
  const { t } = useTranslation();
  const { items, loading, create, reload } = useShoppingLists();

  useReloadOnFocus(reload);

  return (
    <CollectionScreen
      title={t('shopping.title')}
      emoji="🛒"
      addLabel={t('shopping.new')}
      modalTitle={t('shopping.new')}
      loading={loading}
      items={items.map((list) => ({
        id: list.id,
        title: list.name,
        meta: t(`shopping.${list.status}`),
        href: `/shopping/${list.id}` as Href,
      }))}
      renderForm={(onSaved, _item, formRef) => (
        <ShoppingListForm
          ref={formRef}
          hideSubmit
          onSubmit={async (values) => {
            await create(values);
            onSaved();
          }}
        />
      )}
    />
  );
}
