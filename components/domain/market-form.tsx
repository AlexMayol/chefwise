import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { MarketInput } from '@/lib/db/repositories/markets';
import { useTranslation } from '@/lib/i18n';
import { marketSchema, type MarketFormValues } from '@/lib/validation/markets';

type MarketFormProps = {
  initialValues?: Partial<MarketFormValues>;
  onSubmit(values: MarketInput): Promise<void> | void;
};

export function MarketForm({ initialValues, onSubmit }: MarketFormProps) {
  const { t } = useTranslation();
  const form = useForm<MarketFormValues>({
    resolver: zodResolver(marketSchema),
    defaultValues: { name: '', address: '', ...initialValues },
  });

  return (
    <View className="gap-4">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.name')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input value={field.value} placeholder={t('navigation.markets')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Controller
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormField label={t('forms.address')}>
            <Input value={field.value ?? ''} placeholder={t('forms.address')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Button label={t('actions.save')} onPress={form.handleSubmit(onSubmit)} />
    </View>
  );
}
