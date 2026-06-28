import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import { type FormHandle } from '@/components/ui/form-screen-header';
import type { Unit } from '@/lib/domain/units';
import { useTranslation } from '@/lib/i18n';
import { offerSchema, type OfferFormValues } from '@/lib/validation/products';

import { MarketSelect } from './market-select';
import { UnitInput } from './unit-input';

export type OfferFormHandle = FormHandle;

type OfferFormProps = {
  defaultUnit?: Unit;
  hideSubmit?: boolean;
  onSubmit(values: OfferFormValues): Promise<void> | void;
};

// Captures a new offer (market + optional brand + size) plus its first observed price.
export const OfferForm = forwardRef<OfferFormHandle, OfferFormProps>(function OfferForm(
  { defaultUnit = 'unit', hideSubmit = false, onSubmit },
  ref,
) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      marketId: '',
      brand: '',
      quantity: 1,
      unit: defaultUnit,
      price: undefined,
    },
  });

  const submit = form.handleSubmit((values) => onSubmit(values as OfferFormValues));
  useImperativeHandle(ref, () => ({ submit: () => void submit() }));

  // The unit shows inline on the quantity, so the size reads "500 g".
  const unit = form.watch('unit') as Unit;

  return (
    <View className="gap-4">
      <Card className="gap-4">
        <Text className="text-base font-bold text-foreground">{t('forms.basicInformation')}</Text>
        <Controller
          control={form.control}
          name="marketId"
          render={({ field, fieldState }) => (
            <FormField label={t('forms.market')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
              <MarketSelect value={field.value} onChange={field.onChange} />
            </FormField>
          )}
        />
        <ControlledInput control={form.control} name="brand" label={t('forms.brand')} />
        <FormField label={t('forms.unit')}>
          <Controller
            control={form.control}
            name="unit"
            render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />}
          />
        </FormField>
        {/* Full-width stacked like the new-product form: quantity reads "500 g", price "3,99 €". */}
        <ControlledInput
          control={form.control}
          name="quantity"
          label={t('forms.quantity')}
          affix={unit}
          keyboardType="decimal-pad"
        />
        <ControlledInput
          control={form.control}
          name="price"
          label={t('forms.price')}
          placeholder={t('forms.pricePlaceholder')}
          affix="€"
          keyboardType="decimal-pad"
        />
      </Card>
      {hideSubmit ? null : <Button label={t('actions.add')} onPress={() => void submit()} />}
    </View>
  );
});
