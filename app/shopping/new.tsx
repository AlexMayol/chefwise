import { useRouter } from 'expo-router';

import { FeatureScreen } from '@/components/domain/feature-screen';
import { ShoppingListForm } from '@/components/domain/shopping-list-form';
import { ShoppingListItemForm } from '@/components/domain/shopping-list-item-form';
import { useShoppingLists } from '@/lib/hooks/use-shopping-lists';
import { useTranslation } from '@/lib/i18n';

export default function NewShoppingListScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { create } = useShoppingLists();

  return (
    <FeatureScreen title={t('shopping.new')} emoji="🛒" showBack>
      <ShoppingListForm
        onSubmit={async (values) => {
          await create(values);
          router.back();
        }}
      />
      <ShoppingListItemForm />
    </FeatureScreen>
  );
}
