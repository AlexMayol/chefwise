import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import type { ProductInput } from '@/lib/db/repositories/products';
import type { Unit } from '@/lib/domain/units';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useTranslation } from '@/lib/i18n';
import { productSchema, type ProductFormValues } from '@/lib/validation/products';

import { CategorySelect } from './category-select';
import { EntityImageField } from './entity-image-field';
import { MarketSelect } from './market-select';
import { RatingInput } from './rating-input';
import { UnitInput } from './unit-input';

type InitialPrice = { price: number; quantity: number; unit: Unit };

type ProductFormProps = {
  initialValues?: Partial<ProductFormValues>;
  // Defaults to true when initialValues is set; pass false to prefill a create form.
  isEditing?: boolean;
  onSubmit(values: ProductInput, initialPrice?: InitialPrice): Promise<void> | void;
};

export function ProductForm({ initialValues, isEditing = Boolean(initialValues), onSubmit }: ProductFormProps) {
  const { t } = useTranslation();
  const { items: markets } = useMarkets();
  const draftImageId = initialValues?.name || 'draft-product';
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      categoryId: null,
      marketId: markets[0]?.id ?? '',
      defaultUnit: 'unit',
      rating: null,
      notes: '',
      isFavorite: false,
      imagePath: null,
      price: undefined,
      quantity: 1,
      ...initialValues,
    },
  });

  // Markets load async; preselect the first one once they arrive (create only).
  useEffect(() => {
    if (!isEditing && !form.getValues('marketId') && markets.length > 0) {
      form.setValue('marketId', markets[0].id);
    }
  }, [markets, isEditing, form]);

  return (
    <View className="gap-4">
      <ControlledInput control={form.control} name="name" label={t('forms.name')} placeholder={t('products.new')} />
      <Controller
        control={form.control}
        name="marketId"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.market')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <MarketSelect value={field.value} onChange={field.onChange} />
          </FormField>
        )}
      />
      <FormField label={t('forms.defaultUnit')}>
        <Controller
          control={form.control}
          name="defaultUnit"
          render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />}
        />
      </FormField>
      {!isEditing ? (
        <View className="flex-row gap-2">
          <ControlledInput className="flex-1" control={form.control} name="price" label={t('forms.price')} placeholder={t('forms.price')} affix="€" keyboardType="decimal-pad" />
          <ControlledInput className="flex-1" control={form.control} name="quantity" label={t('forms.quantity')} placeholder={t('forms.quantity')} affix={form.watch('defaultUnit')} keyboardType="decimal-pad" />
        </View>
      ) : null}
      <FormField label={t('forms.category')}>
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => <CategorySelect value={field.value} onChange={field.onChange} />}
        />
      </FormField>
      <FormField label={t('forms.rating')}>
        <Controller
          control={form.control}
          name="rating"
          render={({ field }) => <RatingInput value={typeof field.value === 'number' ? field.value : null} onChange={field.onChange} />}
        />
      </FormField>
      <ControlledInput control={form.control} name="notes" label={t('forms.notes')} placeholder={t('forms.notes')} multiline />
      <Controller
        control={form.control}
        name="imagePath"
        render={({ field }) => (
          <FormField label={t('actions.add')}>
            <EntityImageField entityType="product" entityId={draftImageId} value={field.value} onChange={field.onChange} />
          </FormField>
        )}
      />
      <Button
        label={t('actions.save')}
        onPress={form.handleSubmit((values) => {
          const { price, quantity, ...product } = values as ProductFormValues;
          const initialPrice =
            !isEditing && price && price > 0 ? { price, quantity: quantity ?? 1, unit: product.defaultUnit } : undefined;
          return onSubmit(product as ProductInput, initialPrice);
        })}
      />
    </View>
  );
}
