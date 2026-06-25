import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import type { ShoppingListItem } from '@/lib/db/repositories/shopping-lists';
import type { Unit } from '@/lib/domain/units';
import { shoppingPurchaseSchema, type ShoppingPurchaseFormValues } from '@/lib/validation/shopping';
import { useTranslation } from '@/lib/i18n';

import { Button } from '../ui/button';
import { ControlledInput } from '../ui/controlled-input';
import { FormField } from '../ui/form-field';
import { UnitInput } from './unit-input';

type ShoppingPurchaseFormProps = {
  item: ShoppingListItem;
  onBought(values: {
    item: ShoppingListItem;
    actualQuantity: number;
    actualUnit: Unit;
    actualPrice: number;
  }): Promise<void> | void;
  onSkipped(itemId: string): Promise<void> | void;
};

export function ShoppingPurchaseForm({ item, onBought, onSkipped }: ShoppingPurchaseFormProps) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(shoppingPurchaseSchema),
    defaultValues: {
      actualQuantity: item.actualQuantity ?? item.plannedQuantity,
      actualUnit: item.actualUnit ?? item.plannedUnit,
      actualPrice: item.actualPrice ?? 0,
    },
  });

  return (
    <View className="gap-3">
      <ControlledInput control={form.control} name="actualQuantity" label={t('forms.quantity')} keyboardType="decimal-pad" />
      <FormField label={t('forms.unit')}>
        <Controller control={form.control} name="actualUnit" render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />} />
      </FormField>
      <ControlledInput control={form.control} name="actualPrice" label={t('forms.price')} keyboardType="decimal-pad" />
      <View className="flex-row gap-2">
        <Button
          className="flex-1"
          label={t('actions.markBought')}
          onPress={form.handleSubmit((values) => onBought({ item, ...(values as ShoppingPurchaseFormValues) }))}
        />
        <Button className="flex-1" label={t('actions.skip')} variant="ghost" onPress={() => void onSkipped(item.id)} />
      </View>
    </View>
  );
}
