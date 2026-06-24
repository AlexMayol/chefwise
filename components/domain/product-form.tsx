import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { CreatableSelect } from '@/components/ui/creatable-select';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { ProductInput } from '@/lib/db/repositories/products';
import type { Unit } from '@/lib/domain/units';
import { useCategories } from '@/lib/hooks/use-categories';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useTranslation } from '@/lib/i18n';
import { productSchema, type ProductFormValues } from '@/lib/validation/products';

import { CategoryForm } from './category-form';
import { EntityImageField } from './entity-image-field';
import { MarketForm } from './market-form';
import { RatingInput } from './rating-input';
import { UnitInput } from './unit-input';

type InitialPrice = { price: number; quantity: number; unit: Unit };

type ProductFormProps = {
  initialValues?: Partial<ProductFormValues>;
  onSubmit(values: ProductInput, initialPrice?: InitialPrice): Promise<void> | void;
};

export function ProductForm({ initialValues, onSubmit }: ProductFormProps) {
  const { t } = useTranslation();
  const { items: categories, create: createCategory } = useCategories();
  const { items: markets, create: createMarket } = useMarkets();
  const isEditing = Boolean(initialValues);
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

  return (
    <View className="gap-4">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.name')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input value={field.value} placeholder={t('products.new')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Controller
        control={form.control}
        name="marketId"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.market')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <CreatableSelect
              value={field.value}
              onChange={field.onChange}
              options={markets.map((market) => ({ label: market.name, value: market.id }))}
              addLabel={t('markets.new')}
              emptyLabel={t('products.noMarkets')}
              renderCreateForm={(onCreated) => (
                <MarketForm
                  onSubmit={async (values) => {
                    const market = await createMarket(values);
                    onCreated(market.id);
                  }}
                />
              )}
            />
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
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <FormField className="flex-1" label={t('forms.price')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
                <Input affix="€" keyboardType="decimal-pad" value={field.value === undefined ? '' : String(field.value)} placeholder={t('forms.price')} onChangeText={field.onChange} onBlur={field.onBlur} />
              </FormField>
            )}
          />
          <Controller
            control={form.control}
            name="quantity"
            render={({ field, fieldState }) => (
              <FormField className="flex-1" label={t('forms.quantity')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
                <Input affix={form.watch('defaultUnit')} keyboardType="decimal-pad" value={field.value === undefined ? '' : String(field.value)} placeholder={t('forms.quantity')} onChangeText={field.onChange} onBlur={field.onBlur} />
              </FormField>
            )}
          />
        </View>
      ) : null}
      <FormField label={t('forms.category')}>
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <CreatableSelect
              value={field.value ?? 'uncategorized'}
              onChange={(value) => field.onChange(value === 'uncategorized' ? null : value)}
              options={[
                { label: t('common.uncategorized'), value: 'uncategorized' },
                ...categories.map((category) => ({
                  label: category.description ? `${category.description}  ${category.name}` : category.name,
                  value: category.id,
                })),
              ]}
              addLabel={t('categories.new')}
              renderCreateForm={(onCreated) => (
                <CategoryForm
                  onSubmit={async (values) => {
                    const category = await createCategory(values);
                    onCreated(category.id);
                  }}
                />
              )}
            />
          )}
        />
      </FormField>
      <FormField label={t('forms.rating')}>
        <Controller
          control={form.control}
          name="rating"
          render={({ field }) => <RatingInput value={typeof field.value === 'number' ? field.value : null} onChange={field.onChange} />}
        />
      </FormField>
      <Controller
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormField label={t('forms.notes')}>
            <Input multiline value={field.value ?? ''} placeholder={t('forms.notes')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
      <Controller
        control={form.control}
        name="imagePath"
        render={({ field }) => (
          <FormField label={t('actions.add')}>
            <EntityImageField entityType="product" entityId={draftImageId} value={field.value} onChange={field.onChange} />
          </FormField>
        )}
      />
      <Text className="text-sm text-muted-foreground">{t('common.offline')}</Text>
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
