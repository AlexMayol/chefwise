import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import { type FormHandle } from '@/components/ui/form-screen-header';
import { FormSection } from '@/components/ui/form-section';
import type { MarketInput } from '@/lib/db/repositories/markets';
import { useTranslation } from '@/lib/i18n';
import { marketSchema, type MarketFormValues } from '@/lib/validation/markets';

import { DeleteButton } from './delete-button';
import { EntityImageField } from './entity-image-field';

export type MarketFormHandle = FormHandle;

type MarketFormProps = {
  initialValues?: Partial<MarketFormValues>;
  // Hide the in-body Save when a parent (create screen header) drives submit via ref.
  hideSubmit?: boolean;
  onSubmit(values: MarketInput): Promise<void> | void;
  // When provided, a Delete button (handles "in use" errors + back navigation) is shown.
  onDelete?(): Promise<void>;
};

export const MarketForm = forwardRef<MarketFormHandle, MarketFormProps>(function MarketForm(
  { initialValues, hideSubmit = false, onSubmit, onDelete },
  ref,
) {
  const { t } = useTranslation();
  // ponytail: name-based draft id matches product-form; revisit if image filenames must survive rename
  const draftImageId = initialValues?.name || 'draft-market';
  const form = useForm<MarketFormValues>({
    resolver: zodResolver(marketSchema),
    defaultValues: { name: '', address: '', imagePath: null, ...initialValues },
  });

  const submit = form.handleSubmit(onSubmit);
  useImperativeHandle(ref, () => ({ submit: () => void submit() }));

  return (
    <View className="gap-4">
      <FormSection step={1} title={t('forms.basicInformation')}>
        <ControlledInput control={form.control} name="name" label={t('forms.name')} />
        <ControlledInput control={form.control} name="address" label={t('forms.address')} />
        <Controller
          control={form.control}
          name="imagePath"
          render={({ field }) => (
            <FormField label={t('forms.image')}>
              <EntityImageField entityType="market" entityId={draftImageId} value={field.value} onChange={field.onChange} />
            </FormField>
          )}
        />
      </FormSection>
      {hideSubmit ? null : <Button label={t('actions.save')} onPress={() => void submit()} />}
      {onDelete ? <DeleteButton onDelete={onDelete} /> : null}
    </View>
  );
});
