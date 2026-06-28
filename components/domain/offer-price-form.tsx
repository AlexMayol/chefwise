import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { type FormHandle } from '@/components/ui/form-screen-header';
import { FormSection } from '@/components/ui/form-section';
import type { ProductOfferPriceInput } from '@/lib/db/repositories/product-offer-prices';
import { useTranslation } from '@/lib/i18n';
import { offerPriceSchema, type OfferPriceFormValues } from '@/lib/validation/products';

export type OfferPriceFormHandle = FormHandle;

type OfferPriceFormProps = {
  offerId: string;
  hideSubmit?: boolean;
  onSubmit(values: ProductOfferPriceInput): Promise<void> | void;
};

export const OfferPriceForm = forwardRef<OfferPriceFormHandle, OfferPriceFormProps>(function OfferPriceForm(
  { offerId, hideSubmit = false, onSubmit },
  ref,
) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(offerPriceSchema),
    defaultValues: {
      price: 0,
      observedAt: new Date().toISOString(),
    },
  });

  const submit = form.handleSubmit((values) => onSubmit({ offerId, ...(values as OfferPriceFormValues) }));
  useImperativeHandle(ref, () => ({ submit: () => void submit() }));

  return (
    <View className="gap-4">
      <FormSection step={1} title={t('forms.basicInformation')}>
        <ControlledInput control={form.control} name="price" label={t('forms.price')} placeholder={t('forms.pricePlaceholder')} affix="€" keyboardType="decimal-pad" />
        {/* ponytail: observedAt defaults to now; re-add a date field when native datepicker is back */}
      </FormSection>
      {hideSubmit ? null : <Button label={t('offers.addPrice')} onPress={() => void submit()} />}
    </View>
  );
});
