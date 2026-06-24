import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { Market } from '@/lib/db/repositories/markets';
import type { ProductPriceInput } from '@/lib/db/repositories/product-prices';
import type { Unit } from '@/lib/domain/units';
import { useTranslation } from '@/lib/i18n';
import { productPriceSchema, type ProductPriceFormValues } from '@/lib/validation/products';

import { UnitInput } from './unit-input';

type PriceFormProps = {
  productId: string;
  markets?: Market[];
  onSubmit(values: ProductPriceInput): Promise<void> | void;
};

export function PriceForm({ productId, markets = [], onSubmit }: PriceFormProps) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(productPriceSchema),
    defaultValues: {
      marketId: markets[0]?.id ?? '',
      price: 0,
      quantity: 1,
      unit: 'unit',
      observedAt: new Date().toISOString(),
    },
  });

  return (
    <View className="gap-4">
      <Controller
        control={form.control}
        name="marketId"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.market')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            {markets.length > 0 ? (
              <Select value={field.value} onChange={field.onChange} options={markets.map((market) => ({ label: market.name, value: market.id }))} />
            ) : (
              <Input value={field.value} placeholder={t('forms.market')} onChangeText={field.onChange} onBlur={field.onBlur} />
            )}
          </FormField>
        )}
      />
      <Controller
        control={form.control}
        name="price"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.price')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input keyboardType="decimal-pad" value={String(field.value)} placeholder={t('forms.price')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Controller
        control={form.control}
        name="quantity"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.quantity')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input keyboardType="decimal-pad" value={String(field.value)} placeholder={t('forms.quantity')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <FormField label={t('forms.unit')}>
        <Controller
          control={form.control}
          name="unit"
          render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />}
        />
      </FormField>
      <Controller
        control={form.control}
        name="observedAt"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.observedAt')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input value={field.value} placeholder="YYYY-MM-DD" onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Button
        label={t('actions.add')}
        onPress={form.handleSubmit((values) => onSubmit({ productId, ...(values as ProductPriceFormValues) }))}
      />
    </View>
  );
}
