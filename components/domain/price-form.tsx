import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import type { ProductPriceInput } from '@/lib/db/repositories/product-prices';
import type { Unit } from '@/lib/domain/units';
import { useTranslation } from '@/lib/i18n';
import { productPriceSchema, type ProductPriceFormValues } from '@/lib/validation/products';

import { UnitInput } from './unit-input';

type PriceFormProps = {
  productId: string;
  onSubmit(values: ProductPriceInput): Promise<void> | void;
};

export function PriceForm({ productId, onSubmit }: PriceFormProps) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(productPriceSchema),
    defaultValues: {
      price: 0,
      quantity: 1,
      unit: 'unit',
      observedAt: new Date().toISOString(),
    },
  });

  return (
    <View className="gap-4">
      <ControlledInput control={form.control} name="price" label={t('forms.price')} placeholder={t('forms.price')} keyboardType="decimal-pad" />
      <ControlledInput control={form.control} name="quantity" label={t('forms.quantity')} placeholder={t('forms.quantity')} keyboardType="decimal-pad" />
      <FormField label={t('forms.unit')}>
        <Controller
          control={form.control}
          name="unit"
          render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />}
        />
      </FormField>
      {/* ponytail: observedAt defaults to now; re-add a date field when native datepicker is back */}
      <Button
        label={t('actions.add')}
        onPress={form.handleSubmit((values) => onSubmit({ productId, ...(values as ProductPriceFormValues) }))}
      />
    </View>
  );
}
