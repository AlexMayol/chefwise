import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { type FormHandle } from '@/components/ui/form-screen-header';
import { FormSection } from '@/components/ui/form-section';
import type { ShoppingListInput } from '@/lib/db/repositories/shopping-lists';
import { useTranslation } from '@/lib/i18n';
import { shoppingListSchema } from '@/lib/validation/shopping';

export type ShoppingListFormHandle = FormHandle;

type ShoppingListFormProps = {
  hideSubmit?: boolean;
  onSubmit(values: ShoppingListInput): Promise<void> | void;
};

export const ShoppingListForm = forwardRef<ShoppingListFormHandle, ShoppingListFormProps>(function ShoppingListForm(
  { hideSubmit = false, onSubmit },
  ref,
) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(shoppingListSchema),
    defaultValues: { name: '', status: 'draft', items: [] },
  });

  const submit = form.handleSubmit((values) => onSubmit({ name: values.name, status: values.status }));
  useImperativeHandle(ref, () => ({ submit: () => void submit() }));

  return (
    <View className="gap-4">
      <FormSection step={1} title={t('forms.basicInformation')}>
        <ControlledInput control={form.control} name="name" label={t('forms.name')} />
      </FormSection>
      {hideSubmit ? null : <Button label={t('actions.save')} onPress={() => void submit()} />}
    </View>
  );
});
