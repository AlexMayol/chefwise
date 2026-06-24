import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { ShoppingListInput } from '@/lib/db/repositories/shopping-lists';
import { useTranslation } from '@/lib/i18n';
import { shoppingListSchema } from '@/lib/validation/shopping';

export function ShoppingListForm({ onSubmit }: { onSubmit(values: ShoppingListInput): Promise<void> | void }) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(shoppingListSchema),
    defaultValues: { name: '', status: 'draft', items: [] },
  });

  return (
    <View className="gap-4">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.name')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input value={field.value} placeholder={t('shopping.new')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Button label={t('actions.save')} onPress={form.handleSubmit((values) => onSubmit({ name: values.name, status: values.status }))} />
    </View>
  );
}
