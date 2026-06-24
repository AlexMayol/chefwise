import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { ShoppingListItemInput } from '@/lib/db/repositories/shopping-lists';
import type { Unit } from '@/lib/domain/units';
import { useTranslation } from '@/lib/i18n';
import { shoppingListItemSchema } from '@/lib/validation/shopping';

import { ProductSelector } from './product-selector';
import { UnitInput } from './unit-input';

export function ShoppingListItemForm({
  shoppingListId,
  onSubmit,
}: {
  shoppingListId?: string;
  onSubmit?: (values: ShoppingListItemInput) => Promise<void> | void;
}) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(shoppingListItemSchema),
    defaultValues: { productId: '', plannedQuantity: 1, plannedUnit: 'unit', status: 'pending' },
  });

  return (
    <View className="gap-4">
      <Controller
        control={form.control}
        name="productId"
        render={({ field, fieldState }) => (
          <FormField label={t('navigation.products')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <ProductSelector value={field.value} onChange={field.onChange} />
          </FormField>
        )}
      />
      <Controller
        control={form.control}
        name="plannedQuantity"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.quantity')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input keyboardType="decimal-pad" value={String(field.value)} placeholder={t('forms.quantity')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <FormField label={t('forms.unit')}>
        <Controller
          control={form.control}
          name="plannedUnit"
          render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />}
        />
      </FormField>
      <Button
        label={t('actions.add')}
        disabled={!shoppingListId || !onSubmit}
        onPress={form.handleSubmit((values) => {
          if (shoppingListId && onSubmit) {
            return onSubmit({
              shoppingListId,
              productId: values.productId,
              plannedQuantity: Number(values.plannedQuantity),
              plannedUnit: values.plannedUnit as Unit,
            });
          }
          return undefined;
        })}
      />
    </View>
  );
}
