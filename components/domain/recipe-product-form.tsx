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
import type { RecipeProductInput } from '@/lib/db/repositories/recipes';
import type { Unit } from '@/lib/domain/units';
import { useProductOffers } from '@/lib/hooks/use-product-offers';
import { useTranslation } from '@/lib/i18n';
import { recipeProductSchema } from '@/lib/validation/recipes';

import { ProductSelector } from './product-selector';
import { UnitInput } from './unit-input';

export type RecipeProductFormHandle = FormHandle;

type RecipeProductFormProps = {
  recipeId?: string;
  hideSubmit?: boolean;
  onSubmit?: (values: RecipeProductInput) => Promise<void> | void;
};

export const RecipeProductForm = forwardRef<RecipeProductFormHandle, RecipeProductFormProps>(function RecipeProductForm(
  { recipeId, hideSubmit = false, onSubmit },
  ref,
) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(recipeProductSchema),
    defaultValues: { productId: '', offerId: '', quantity: 1, unit: 'unit' },
  });
  const productId = form.watch('productId');
  const { items: offers } = useProductOffers(productId || undefined);

  const submit = form.handleSubmit((values) => {
    if (recipeId && onSubmit) {
      return onSubmit({
        recipeId,
        productId: values.productId,
        offerId: values.offerId || null,
        quantity: Number(values.quantity),
        unit: values.unit as Unit,
      });
    }
    return undefined;
  });
  useImperativeHandle(ref, () => ({ submit: () => void submit() }));

  return (
    <View className="gap-4">
      <FormSection step={1} title={t('forms.basicInformation')}>
        <Controller
          control={form.control}
          name="productId"
          render={({ field, fieldState }) => (
            <FormField label={t('navigation.products')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
              <ProductSelector
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  form.setValue('offerId', '');
                }}
              />
            </FormField>
          )}
        />
        {offers.length > 0 ? (
          <FormField label={t('offers.title')}>
            <Controller
              control={form.control}
              name="offerId"
              render={({ field }) => (
                <Select<string>
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  options={[
                    { label: t('offers.cheapestAuto'), value: '' },
                    ...offers.map((offer) => ({
                      label: `${offer.marketName ?? ''}${offer.brand ? ` · ${offer.brand}` : ''} · ${offer.quantity} ${offer.unit}`,
                      value: offer.id,
                    })),
                  ]}
                />
              )}
            />
          </FormField>
        ) : null}
        <ControlledInput control={form.control} name="quantity" label={t('forms.quantity')} keyboardType="decimal-pad" />
        <FormField label={t('forms.unit')}>
          <Controller
            control={form.control}
            name="unit"
            render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />}
          />
        </FormField>
      </FormSection>
      {hideSubmit ? null : (
        <Button label={t('actions.add')} disabled={!recipeId || !onSubmit} onPress={() => void submit()} />
      )}
    </View>
  );
});
