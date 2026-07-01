import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Switch, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import { CollapsibleChevron } from '@/components/ui/collapsible-chevron';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import { type FormHandle } from '@/components/ui/form-screen-header';

import type { ProductInput } from '@/lib/db/repositories/products';
import type { Unit } from '@/lib/domain/units';
import { useTranslation } from '@/lib/i18n';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { productCreateSchema, type ProductFormValues } from '@/lib/validation/products';

import { CategorySelect } from './category-select';
import { MarketSelect } from './market-select';
import { UnitInput } from './unit-input';

export type ProductFormHandle = FormHandle;
export type InitialPrice = { marketId: string; priceUnit: Unit; price: number };

type ProductFormProps = {
  initialValues?: Partial<ProductFormValues>;
  // Defaults to true when initialValues is set; pass false to prefill a create form.
  isEditing?: boolean;
  // Hide the in-body Save button when a parent (e.g. the create screen header) drives submit via ref.
  hideSubmit?: boolean;
  // Show the optional "Initial price" section (create flow only).
  withInitialPrice?: boolean;
  onSubmit(values: ProductInput, initialPrice?: InitialPrice): Promise<void> | void;
};

// A product is now generic: market, brand, size and price live on its offers.
// On the create screen, an optional first price can be captured inline.
export const ProductForm = forwardRef<ProductFormHandle, ProductFormProps>(function ProductForm(
  { initialValues, isEditing = Boolean(initialValues), hideSubmit = false, withInitialPrice = false, onSubmit },
  ref,
) {
  const { t } = useTranslation();
  const tokens = useDesignTokens();
  const [showMore, setShowMore] = useState(false);
  // One schema for both flows: the price fields are all optional, so an edit form
  // (withInitialPrice off, price section hidden) parses cleanly with them left blank.
  const form = useForm({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: '',
      categoryId: null,
      defaultUnit: 'unit',
      isFavorite: false,
      marketId: null,
      price: undefined,
      ...initialValues,
    },
  });

  const submit = form.handleSubmit((values) => {
    // When withInitialPrice is off the resolver strips the price keys, so they read as undefined here.
    const { marketId, price, ...product } = values as ProductInput & Partial<InitialPrice>;
    if (withInitialPrice && typeof price === 'number' && marketId) {
      // The default unit doubles as the price's per-unit (the "3 € / kg" reading).
      onSubmit(product as ProductInput, { marketId, priceUnit: product.defaultUnit as Unit, price });
    } else {
      onSubmit(product as ProductInput);
    }
  });
  useImperativeHandle(ref, () => ({ submit: () => void submit() }));

  // The default unit is also the price's per-unit, so the price reads "3 € / kg".
  const unit = form.watch('defaultUnit') as Unit;

  return (
    <View className="gap-4">
      {/* Essentials: the only fields needed for a quick capture at the shelf. */}
      <Card className="gap-4">
        <Text className="text-base font-bold text-foreground">{t('forms.basicInformation')}</Text>
        <ControlledInput control={form.control} name="name" label={t('forms.name')} placeholder={t('forms.namePlaceholder')} />
        {withInitialPrice ? (
          <Controller
            control={form.control}
            name="marketId"
            render={({ field, fieldState }) => (
              <FormField label={t('forms.market')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
                <MarketSelect value={field.value ?? undefined} onChange={field.onChange} />
              </FormField>
            )}
          />
        ) : null}
        <FormField label={t('forms.defaultUnit')}>
          <Controller
            control={form.control}
            name="defaultUnit"
            render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />}
          />
          <Text className="text-xs text-muted-foreground">{t('forms.unitHelp')}</Text>
        </FormField>
        {/* Price sits right under the unit and shows it inline, e.g. "3 € / kg". */}
        {withInitialPrice ? (
          <ControlledInput
            control={form.control}
            name="price"
            label={t('forms.price')}
            placeholder={t('forms.pricePlaceholder')}
            affix={`€ / ${unit}`}
            keyboardType="decimal-pad"
          />
        ) : null}
      </Card>

      {/* Everything else folds away — refine it later from the product page. */}
      <Card className="gap-0">
        <Pressable
          className="flex-row items-center gap-2.5 active:opacity-70"
          onPress={() => setShowMore((current) => !current)}>
          <Text className="flex-1 text-base font-bold text-foreground">{t('forms.productDetailsOptional')}</Text>
          <CollapsibleChevron expanded={showMore} color={tokens.mutedForeground} />
        </Pressable>
        <Collapsible expanded={showMore}>
          <View className="gap-4 pt-4">
            <FormField label={t('forms.category')}>
              <Controller
                control={form.control}
                name="categoryId"
                render={({ field }) => <CategorySelect value={field.value} onChange={field.onChange} />}
              />
            </FormField>
            <Controller
              control={form.control}
              name="isFavorite"
              render={({ field }) => (
                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-foreground">{t('forms.markFavorite')}</Text>
                  <Switch
                    value={Boolean(field.value)}
                    onValueChange={field.onChange}
                    trackColor={{ true: tokens.primary, false: tokens.border }}
                  />
                </View>
              )}
            />
          </View>
        </Collapsible>
      </Card>

      {hideSubmit ? null : <Button label={t('actions.save')} onPress={() => void submit()} />}
    </View>
  );
});
