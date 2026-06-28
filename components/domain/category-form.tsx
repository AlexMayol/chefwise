import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import { type FormHandle } from '@/components/ui/form-screen-header';
import { FormSection } from '@/components/ui/form-section';
import type { CategoryInput } from '@/lib/db/repositories/categories';
import { useTranslation } from '@/lib/i18n';
import { categorySchema } from '@/lib/validation/products';

import { DeleteButton } from './delete-button';
import { EmojiPicker } from './emoji-picker';

export type CategoryFormHandle = FormHandle;

type CategoryFormProps = {
  initialValues?: CategoryInput;
  // Hide the in-body Save when a parent (header/sheet) drives submit via ref.
  hideSubmit?: boolean;
  onSubmit(values: CategoryInput): Promise<void> | void;
  onDelete?(): Promise<void>;
};

export const CategoryForm = forwardRef<CategoryFormHandle, CategoryFormProps>(function CategoryForm(
  { initialValues, hideSubmit = false, onSubmit, onDelete },
  ref,
) {
  const { t } = useTranslation();
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialValues ?? { name: '', description: null },
  });

  const submit = form.handleSubmit(onSubmit);
  useImperativeHandle(ref, () => ({ submit: () => void submit() }));

  return (
    <View className="gap-4">
      <FormSection step={1} title={t('forms.basicInformation')}>
        <ControlledInput control={form.control} name="name" label={t('forms.category')} />
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormField label={t('forms.emoji')}>
              <EmojiPicker value={field.value} onChange={field.onChange} />
            </FormField>
          )}
        />
      </FormSection>
      {hideSubmit ? null : <Button label={t('actions.save')} onPress={() => void submit()} />}
      {onDelete ? <DeleteButton onDelete={onDelete} /> : null}
    </View>
  );
});
