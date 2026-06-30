import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import { type FormHandle } from '@/components/ui/form-screen-header';
import { FormSection } from '@/components/ui/form-section';
import type { RecipeCategoryInput } from '@/lib/db/repositories/recipe-categories';
import { useTranslation } from '@/lib/i18n';
import { recipeCategorySchema } from '@/lib/validation/recipes';

import { DeleteButton } from './delete-button';
import { EmojiPicker } from './emoji-picker';

export type RecipeCategoryFormHandle = FormHandle;

type RecipeCategoryFormProps = {
  initialValues?: RecipeCategoryInput;
  // Hide the in-body Save when a parent (header/sheet) drives submit via ref.
  hideSubmit?: boolean;
  onSubmit(values: RecipeCategoryInput): Promise<void> | void;
  onDelete?(): Promise<void>;
};

export const RecipeCategoryForm = forwardRef<RecipeCategoryFormHandle, RecipeCategoryFormProps>(
  function RecipeCategoryForm({ initialValues, hideSubmit = false, onSubmit, onDelete }, ref) {
    const { t } = useTranslation();
    const form = useForm<RecipeCategoryInput>({
      resolver: zodResolver(recipeCategorySchema),
      defaultValues: initialValues ?? { name: '', emoji: null, description: '' },
    });

    const submit = form.handleSubmit(onSubmit);
    useImperativeHandle(ref, () => ({ submit: () => void submit() }));

    return (
      <View className="gap-4">
        <FormSection step={1} title={t('forms.basicInformation')}>
          <Controller
            control={form.control}
            name="emoji"
            render={({ field }) => (
              <FormField label={t('forms.emoji')}>
                <EmojiPicker value={field.value} onChange={field.onChange} />
              </FormField>
            )}
          />
          <ControlledInput
            control={form.control}
            name="name"
            label={t('forms.name')}
            placeholder={t('recipeCategories.namePlaceholder')}
          />
          <ControlledInput
            control={form.control}
            name="description"
            label={t('forms.description')}
            placeholder={t('recipeCategories.descriptionPlaceholder')}
            multiline
          />
        </FormSection>
        {hideSubmit ? null : <Button label={t('actions.save')} onPress={() => void submit()} />}
        {onDelete ? <DeleteButton onDelete={onDelete} /> : null}
      </View>
    );
  },
);
