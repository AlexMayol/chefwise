import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { RecipeInput } from '@/lib/db/repositories/recipes';
import { useTranslation } from '@/lib/i18n';
import { recipeSchema, type RecipeFormValues } from '@/lib/validation/recipes';

export function RecipeForm({ onSubmit }: { onSubmit(values: RecipeInput): Promise<void> | void }) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      description: '',
      servings: 1,
      pricingStrategy: 'manual',
      imagePath: null,
      ingredients: [],
    },
  });

  return (
    <View className="gap-4">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.name')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input value={field.value} placeholder={t('recipes.new')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormField label={t('forms.description')}>
            <Input multiline value={field.value ?? ''} placeholder={t('forms.description')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Controller
        control={form.control}
        name="servings"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.servings')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input keyboardType="decimal-pad" value={String(field.value)} placeholder={t('forms.servings')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Controller
        control={form.control}
        name="pricingStrategy"
        render={({ field }) => (
          <Select
            value={field.value}
            onChange={field.onChange}
            options={[
              { label: t('recipes.manual'), value: 'manual' },
              { label: t('recipes.cheapestAvailable'), value: 'cheapest_available' },
            ]}
          />
        )}
      />
      <Button label={t('actions.save')} onPress={form.handleSubmit((values) => onSubmit(values as RecipeFormValues))} />
    </View>
  );
}
