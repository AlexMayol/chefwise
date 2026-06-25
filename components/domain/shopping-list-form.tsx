import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
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
      <ControlledInput control={form.control} name="name" label={t('forms.name')} placeholder={t('shopping.new')} />
      <Button label={t('actions.save')} onPress={form.handleSubmit((values) => onSubmit({ name: values.name, status: values.status }))} />
    </View>
  );
}
