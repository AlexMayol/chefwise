import { useCallback } from 'react';

import { CollectionScreen } from '@/components/domain/collection-screen';
import { ShoppingListForm } from '@/components/domain/shopping-list-form';
import { useShoppingLists } from '@/lib/hooks/use-shopping-lists';
import { useTranslation } from '@/lib/i18n';
import { useFocusEffect, type Href } from 'expo-router';

export default function ShoppingScreen() {
  const { t } = useTranslation();
  const { items, loading, create, reload } = useShoppingLists();

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

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
