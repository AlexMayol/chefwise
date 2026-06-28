import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteButton } from '@/components/domain/delete-button';
import { FeatureScreen } from '@/components/domain/feature-screen';
import { ShoppingListItemForm, type ShoppingListItemFormHandle } from '@/components/domain/shopping-list-item-form';
import { ShoppingPurchaseForm } from '@/components/domain/shopping-purchase-form';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { ListRow } from '@/components/ui/list-row';
import { useShoppingListDetail, useShoppingLists } from '@/lib/hooks/use-shopping-lists';
import { useTranslation } from '@/lib/i18n';

export default function ShoppingListDetailScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { shoppingListId } = useLocalSearchParams<{ shoppingListId: string }>();
  const { duplicateAsDraft } = useShoppingLists();
  const { items, addItem, markBought, markSkipped, remove } = useShoppingListDetail(shoppingListId);
  const [addOpen, setAddOpen] = useState(false);
  const addFormRef = useRef<ShoppingListItemFormHandle>(null);

  return (
    <FeatureScreen title={t('shopping.title')} description={t('shopping.pending')} emoji="🛒" showBack>
      <Button label={t('shopping.addItem')} variant="secondary" onPress={() => setAddOpen(true)} />
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
      <DeleteButton onDelete={remove} />

      <BottomSheet visible={addOpen} onClose={() => setAddOpen(false)} bottomInset={insets.bottom}>
        <FormScreenHeader
          title={t('shopping.addItem')}
          onCancel={() => setAddOpen(false)}
          onSave={() => addFormRef.current?.submit()}
        />
        <ShoppingListItemForm
          ref={addFormRef}
          shoppingListId={shoppingListId}
          hideSubmit
          onSubmit={async (values) => {
            await addItem(values);
            setAddOpen(false);
          }}
        />
      </BottomSheet>
    </FeatureScreen>
  );
}
