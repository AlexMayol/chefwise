import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { type FormHandle } from '@/components/ui/form-screen-header';
import { FormSection } from '@/components/ui/form-section';
import type { RecipeInput } from '@/lib/db/repositories/recipes';
import { useTranslation } from '@/lib/i18n';
import { recipeSchema, type RecipeFormValues } from '@/lib/validation/recipes';

export type RecipeFormHandle = FormHandle;

type RecipeFormProps = {
  hideSubmit?: boolean;
  onSubmit(values: RecipeInput): Promise<void> | void;
};

export const RecipeForm = forwardRef<RecipeFormHandle, RecipeFormProps>(function RecipeForm(
  { hideSubmit = false, onSubmit },
  ref,
) {
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

  const submit = form.handleSubmit((values) => onSubmit(values as RecipeFormValues));
  useImperativeHandle(ref, () => ({ submit: () => void submit() }));

  return (
    <View className="gap-4">
      <FormSection step={1} title={t('forms.basicInformation')}>
        <ControlledInput control={form.control} name="name" label={t('forms.name')} />
        <ControlledInput control={form.control} name="description" label={t('forms.description')} multiline />
        <ControlledInput control={form.control} name="servings" label={t('forms.servings')} keyboardType="decimal-pad" />
      </FormSection>
      {hideSubmit ? null : <Button label={t('actions.save')} onPress={() => void submit()} />}
    </View>
  );
});
