import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import type { MarketInput } from '@/lib/db/repositories/markets';
import { useTranslation } from '@/lib/i18n';
import { marketSchema, type MarketFormValues } from '@/lib/validation/markets';

import { DeleteButton } from './delete-button';
import { EntityImageField } from './entity-image-field';

type MarketFormProps = {
  initialValues?: Partial<MarketFormValues>;
  onSubmit(values: MarketInput): Promise<void> | void;
  // When provided, a Delete button (handles "in use" errors + back navigation) is shown.
  onDelete?(): Promise<void>;
};

export function MarketForm({ initialValues, onSubmit, onDelete }: MarketFormProps) {
  const { t } = useTranslation();

  // ponytail: name-based draft id matches product-form; revisit if image filenames must survive rename
  const draftImageId = initialValues?.name || 'draft-market';
  const form = useForm<MarketFormValues>({
    resolver: zodResolver(marketSchema),
    defaultValues: { name: '', address: '', imagePath: null, ...initialValues },
  });

  return (
    <View className="gap-4">
      <ControlledInput control={form.control} name="name" label={t('forms.name')} placeholder={t('navigation.markets')} />
      <ControlledInput control={form.control} name="address" label={t('forms.address')} placeholder={t('forms.address')} />
      <Controller
        control={form.control}
        name="imagePath"
        render={({ field }) => (
          <FormField label={t('forms.image')}>
            <EntityImageField entityType="market" entityId={draftImageId} value={field.value} onChange={field.onChange} />
          </FormField>
        )}
      />
      <Button label={t('actions.save')} onPress={form.handleSubmit(onSubmit)} />
      {onDelete ? <DeleteButton onDelete={onDelete} /> : null}
    </View>
  );
}
