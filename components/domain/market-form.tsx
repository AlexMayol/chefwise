import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { MarketInput } from '@/lib/db/repositories/markets';
import { useTranslation } from '@/lib/i18n';
import { marketSchema, type MarketFormValues } from '@/lib/validation/markets';

import { EntityImageField } from './entity-image-field';

type MarketFormProps = {
  initialValues?: Partial<MarketFormValues>;
  onSubmit(values: MarketInput): Promise<void> | void;
  // When provided, a Delete button sits next to Save and runs this on press.
  onDelete?(): Promise<void>;
};

export function MarketForm({ initialValues, onSubmit, onDelete }: MarketFormProps) {
  const { t } = useTranslation();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    try {
      await onDelete?.();
    } catch {
      setDeleteError(t('errors.deleteBlocked'));
    }
  }

  // ponytail: name-based draft id matches product-form; revisit if image filenames must survive rename
  const draftImageId = initialValues?.name || 'draft-market';
  const form = useForm<MarketFormValues>({
    resolver: zodResolver(marketSchema),
    defaultValues: { name: '', address: '', imagePath: null, ...initialValues },
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
      <Controller
        control={form.control}
        name="imagePath"
        render={({ field }) => (
          <FormField label={t('forms.image')}>
            <EntityImageField entityType="market" entityId={draftImageId} value={field.value} onChange={field.onChange} />
          </FormField>
        )}
      />
      <View className="flex-row gap-3">
        <Button className="flex-1" label={t('actions.save')} onPress={form.handleSubmit(onSubmit)} />
        {onDelete ? <Button className="flex-1" variant="destructive" label={t('actions.delete')} onPress={() => void handleDelete()} /> : null}
      </View>
      {deleteError ? <Text className="text-sm text-destructive">{deleteError}</Text> : null}
    </View>
  );
}
