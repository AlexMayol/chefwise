import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { RecipeProductInput } from '@/lib/db/repositories/recipes';
import type { Unit } from '@/lib/domain/units';
import { useTranslation } from '@/lib/i18n';
import { recipeProductSchema } from '@/lib/validation/recipes';

import { ProductSelector } from './product-selector';
import { UnitInput } from './unit-input';

export function RecipeProductForm({
  recipeId,
  onSubmit,
}: {
  recipeId?: string;
  onSubmit?: (values: RecipeProductInput) => Promise<void> | void;
}) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(recipeProductSchema),
    defaultValues: { productId: '', quantity: 1, unit: 'unit' },
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
      <Button
        label={t('actions.add')}
        disabled={!recipeId || !onSubmit}
        onPress={form.handleSubmit((values) => {
          if (recipeId && onSubmit) {
            return onSubmit({ recipeId, productId: values.productId, quantity: Number(values.quantity), unit: values.unit as Unit });
          }
          return undefined;
        })}
      />
    </View>
  );
}
