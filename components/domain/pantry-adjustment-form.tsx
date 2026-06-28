import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import { type FormHandle } from '@/components/ui/form-screen-header';
import { FormSection } from '@/components/ui/form-section';
import { Select } from '@/components/ui/select';
import type { PantryTransactionType } from '@/lib/db/repositories/pantry';
import type { Unit } from '@/lib/domain/units';
import { useTranslation } from '@/lib/i18n';
import { pantryAdjustmentSchema, type PantryAdjustmentFormValues } from '@/lib/validation/pantry';

import { ProductSelector } from './product-selector';
import { UnitInput } from './unit-input';

export type PantryAdjustmentFormHandle = FormHandle;

type PantryAdjustmentFormProps = {
  hideSubmit?: boolean;
  onSubmit(values: PantryAdjustmentFormValues): Promise<void> | void;
};

export const PantryAdjustmentForm = forwardRef<PantryAdjustmentFormHandle, PantryAdjustmentFormProps>(
  function PantryAdjustmentForm({ hideSubmit = false, onSubmit }, ref) {
    const { t } = useTranslation();
    const form = useForm({
      resolver: zodResolver(pantryAdjustmentSchema),
      defaultValues: { productId: '', type: 'add', quantity: 1, unit: 'unit', note: '' },
    });

    const submit = form.handleSubmit((values) => onSubmit(values as PantryAdjustmentFormValues));
    useImperativeHandle(ref, () => ({ submit: () => void submit() }));

    return (
      <View className="gap-4">
        <FormSection step={1} title={t('forms.basicInformation')}>
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
            name="type"
            render={({ field }) => (
              <Select<PantryTransactionType>
                value={field.value as PantryTransactionType}
                onChange={field.onChange}
                options={[
                  { label: t('pantry.add'), value: 'add' },
                  { label: t('pantry.remove'), value: 'remove' },
                  { label: t('pantry.adjust'), value: 'adjust' },
                  { label: t('pantry.waste'), value: 'waste' },
                ]}
              />
            )}
          />
          <ControlledInput control={form.control} name="quantity" label={t('forms.quantity')} keyboardType="decimal-pad" />
          <FormField label={t('forms.unit')}>
            <Controller
              control={form.control}
              name="unit"
              render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />}
            />
          </FormField>
        </FormSection>
        {hideSubmit ? null : <Button label={t('actions.save')} onPress={() => void submit()} />}
      </View>
    );
  },
);
