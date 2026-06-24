import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { CategoryInput } from '@/lib/db/repositories/categories';
import { useTranslation } from '@/lib/i18n';
import { categorySchema } from '@/lib/validation/products';

export function CategoryForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: CategoryInput;
  onSubmit(values: CategoryInput): Promise<void> | void;
}) {
  const { t } = useTranslation();
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialValues ?? { name: '' },
  });

  return (
    <View className="gap-4">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.category')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input value={field.value} placeholder={t('common.uncategorized')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Button label={t('actions.save')} onPress={form.handleSubmit(onSubmit)} />
    </View>
  );
}
