import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import { CollapsibleChevron } from '@/components/ui/collapsible-chevron';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import { type FormHandle } from '@/components/ui/form-screen-header';
import { Input } from '@/components/ui/input';

import { createId } from '@/lib/db/repositories/base';
import type { Unit } from '@/lib/domain/units';
import { useTranslation } from '@/lib/i18n';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { offerCreateSchema, offerSchema, type OfferCreateValues } from '@/lib/validation/products';

import { EntityImageField } from './entity-image-field';
import { MarketSelect } from './market-select';
import { RatingInput } from './rating-input';
import { UnitInput } from './unit-input';

const DESCRIPTION_MAX = 200;

export type OfferFormHandle = FormHandle;

type OfferFormProps = {
  defaultUnit?: Unit;
  hideSubmit?: boolean;
  // Create captures a first price; pass withPrice={false} when editing an existing offer.
  withPrice?: boolean;
  // OfferCreateValues (not OfferFormValues) so an existing offer's price can prefill on edit.
  initialValues?: Partial<OfferCreateValues>;
  // The offer's id when editing, so its image saves under a stable path.
  offerId?: string;
  onSubmit(values: OfferCreateValues): Promise<void> | void;
};

// Captures (or edits) an offer: market + optional brand + size, plus the rating, photo and
// description that describe it at that market. On create, the first observed price too.
export const OfferForm = forwardRef<OfferFormHandle, OfferFormProps>(function OfferForm(
  { defaultUnit = 'unit', hideSubmit = false, withPrice = true, initialValues, offerId, onSubmit },
  ref,
) {
  const { t } = useTranslation();
  const tokens = useDesignTokens();
  const [showMore, setShowMore] = useState(false);
  // Stable image path for a brand-new offer (id is minted on save); the real id when editing.
  // ponytail: like ProductForm's draftImageId — the path is just a stored string.
  const [draftImageId] = useState(() => offerId ?? createId('offer'));

  // Typed as the create superset (price included) so the price field type-checks; the edit
  // resolver (no price) is a structural subset, hence the cast.
  const form = useForm<OfferCreateValues>({
    resolver: zodResolver(withPrice ? offerCreateSchema : offerSchema) as unknown as Resolver<OfferCreateValues>,
    defaultValues: {
      marketId: '',
      brand: '',
      quantity: 1,
      unit: defaultUnit,
      rating: null,
      imagePath: null,
      description: '',
      price: undefined,
      ...initialValues,
    },
  });

  const submit = form.handleSubmit((values) => onSubmit(values as OfferCreateValues));
  useImperativeHandle(ref, () => ({ submit: () => void submit() }));

  // The unit shows inline on the quantity, so the size reads "500 g".
  const unit = form.watch('unit') as Unit;

  return (
    <View className="gap-4">
      <Card className="gap-4">
        <Text className="text-base font-bold text-foreground">{t('forms.basicInformation')}</Text>
        <Controller
          control={form.control}
          name="marketId"
          render={({ field, fieldState }) => (
            <FormField label={t('forms.market')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
              <MarketSelect value={field.value} onChange={field.onChange} />
            </FormField>
          )}
        />
        <ControlledInput control={form.control} name="brand" label={t('forms.brand')} />
        <FormField label={t('forms.unit')}>
          <Controller
            control={form.control}
            name="unit"
            render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />}
          />
        </FormField>
        {/* Full-width stacked like the new-product form: quantity reads "500 g", price "3,99 €". */}
        <ControlledInput
          control={form.control}
          name="quantity"
          label={t('forms.quantity')}
          affix={unit}
          keyboardType="decimal-pad"
        />
        {withPrice ? (
          <ControlledInput
            control={form.control}
            name="price"
            label={t('forms.price')}
            placeholder={t('forms.pricePlaceholder')}
            affix="€"
            keyboardType="decimal-pad"
          />
        ) : null}
      </Card>

      {/* Rating, photo and description describe the offer at this market — all optional. */}
      <Card className="gap-0">
        <Pressable
          className="flex-row items-center gap-2.5 active:opacity-70"
          onPress={() => setShowMore((current) => !current)}>
          <Text className="flex-1 text-base font-bold text-foreground">{t('forms.offerDetailsOptional')}</Text>
          <CollapsibleChevron expanded={showMore} color={tokens.mutedForeground} />
        </Pressable>
        <Collapsible expanded={showMore}>
          <View className="gap-4 pt-4">
            <Controller
              control={form.control}
              name="imagePath"
              render={({ field }) => (
                <FormField label={t('forms.image')}>
                  <EntityImageField entityType="offer" entityId={draftImageId} value={field.value} onChange={field.onChange} />
                </FormField>
              )}
            />
            <FormField label={t('forms.rating')}>
              <Controller
                control={form.control}
                name="rating"
                render={({ field }) => {
                  const value = typeof field.value === 'number' ? field.value : null;
                  return (
                    <View className="flex-row items-center gap-3">
                      <RatingInput value={value} onChange={field.onChange} />
                      {value ? <Text className="text-sm text-muted-foreground">{t('forms.ratingOutOf', { value })}</Text> : null}
                    </View>
                  );
                }}
              />
            </FormField>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormField label={t('forms.description')}>
                  <Input
                    value={field.value ?? ''}
                    multiline
                    maxLength={DESCRIPTION_MAX}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                  <Text className="self-end text-xs text-muted-foreground">
                    {field.value?.length ?? 0}/{DESCRIPTION_MAX}
                  </Text>
                </FormField>
              )}
            />
          </View>
        </Collapsible>
      </Card>

      {hideSubmit ? null : <Button label={t('actions.save')} onPress={() => void submit()} />}
    </View>
  );
});
