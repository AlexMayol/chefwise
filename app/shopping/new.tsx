import { FeatureScreen } from '@/components/domain/feature-screen';
import { ShoppingListForm } from '@/components/domain/shopping-list-form';
import { ShoppingListItemForm } from '@/components/domain/shopping-list-item-form';
import { useCreateAndNavigateBack } from '@/lib/hooks/use-create-and-back';
import { useShoppingLists } from '@/lib/hooks/use-shopping-lists';
import { useTranslation } from '@/lib/i18n';

export default function NewShoppingListScreen() {
  const { t } = useTranslation();
  const { create } = useShoppingLists();

  return (
    <FeatureScreen title={t('shopping.new')} emoji="🛒" showBack>
      <ShoppingListForm onSubmit={useCreateAndNavigateBack(create)} />
      <ShoppingListItemForm />
    </FeatureScreen>
  );
}
