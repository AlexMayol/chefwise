import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import type { ShoppingListItem } from '@/lib/db/repositories/shopping-lists';
import type { Unit } from '@/lib/domain/units';
import { shoppingPurchaseSchema, type ShoppingPurchaseFormValues } from '@/lib/validation/shopping';
import { useTranslation } from '@/lib/i18n';

import { Button } from '../ui/button';
import { FormField } from '../ui/form-field';
import { Input } from '../ui/input';
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
      <Controller
        control={form.control}
        name="actualQuantity"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.quantity')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input keyboardType="decimal-pad" value={String(field.value)} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <FormField label={t('forms.unit')}>
        <Controller control={form.control} name="actualUnit" render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />} />
      </FormField>
      <Controller
        control={form.control}
        name="actualPrice"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.price')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input keyboardType="decimal-pad" value={String(field.value)} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
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
