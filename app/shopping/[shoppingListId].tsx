import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { FeatureScreen } from '@/components/domain/feature-screen';
import { ShoppingListItemForm } from '@/components/domain/shopping-list-item-form';
import { ShoppingPurchaseForm } from '@/components/domain/shopping-purchase-form';
import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { useShoppingListDetail, useShoppingLists } from '@/lib/hooks/use-shopping-lists';
import { useTranslation } from '@/lib/i18n';

export default function ShoppingListDetailScreen() {
  const { t } = useTranslation();
  const { shoppingListId } = useLocalSearchParams<{ shoppingListId: string }>();
  const { duplicateAsDraft } = useShoppingLists();
  const { items, addItem, markBought, markSkipped } = useShoppingListDetail(shoppingListId);

  return (
    <FeatureScreen title={t('shopping.title')} description={t('shopping.pending')}>
      <ShoppingListItemForm
        shoppingListId={shoppingListId}
        onSubmit={async (values) => {
          await addItem(values);
        }}
      />
      {items.map((item) =>
        item.status === 'pending' ? (
          <ShoppingPurchaseForm key={item.id} item={item} onBought={markBought} onSkipped={markSkipped} />
        ) : (
          <ListRow key={item.id} title={item.productId} subtitle={`${item.plannedQuantity} ${item.plannedUnit}`} meta={t(`shopping.${item.status}`)} />
        ),
      )}
      <View className="flex-row gap-2">
        <Button className="flex-1" label={t('actions.duplicate')} variant="secondary" onPress={() => void duplicateAsDraft(shoppingListId, t('shopping.new'))} />
        <Button className="flex-1" label={t('actions.buyAgain')} variant="ghost" onPress={() => void duplicateAsDraft(shoppingListId, t('shopping.new'))} />
      </View>
    </FeatureScreen>
  );
}
