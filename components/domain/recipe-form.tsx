import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
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
      imagePath: null,
      ingredients: [],
    },
  });

  return (
    <View className="gap-4">
      <ControlledInput control={form.control} name="name" label={t('forms.name')} placeholder={t('recipes.new')} />
      <ControlledInput control={form.control} name="description" label={t('forms.description')} placeholder={t('forms.description')} multiline />
      <ControlledInput control={form.control} name="servings" label={t('forms.servings')} placeholder={t('forms.servings')} keyboardType="decimal-pad" />
      <Button label={t('actions.save')} onPress={form.handleSubmit((values) => onSubmit(values as RecipeFormValues))} />
    </View>
  );
}
