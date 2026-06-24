import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { ProductInput } from '@/lib/db/repositories/products';
import type { Unit } from '@/lib/domain/units';
import { useCategories } from '@/lib/hooks/use-categories';
import { useTranslation } from '@/lib/i18n';
import { productSchema, type ProductFormValues } from '@/lib/validation/products';

import { EntityImageField } from './entity-image-field';
import { RatingInput } from './rating-input';
import { UnitInput } from './unit-input';

type ProductFormProps = {
  initialValues?: Partial<ProductFormValues>;
  onSubmit(values: ProductInput): Promise<void> | void;
};

export function ProductForm({ initialValues, onSubmit }: ProductFormProps) {
  const { t } = useTranslation();
  const { items: categories } = useCategories();
  const draftImageId = initialValues?.name || 'draft-product';
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      categoryId: null,
      defaultUnit: 'unit',
      rating: null,
      notes: '',
      isFavorite: false,
      imagePath: null,
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
      <FormField label={t('forms.defaultUnit')}>
        <Controller
          control={form.control}
          name="defaultUnit"
          render={({ field }) => <UnitInput value={field.value as Unit} onChange={field.onChange} />}
        />
      </FormField>
      <FormField label={t('forms.category')}>
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <Select
              value={field.value ?? 'uncategorized'}
              onChange={(value) => field.onChange(value === 'uncategorized' ? null : value)}
              options={[
                { label: t('common.uncategorized'), value: 'uncategorized' },
                ...categories.map((category) => ({ label: category.name, value: category.id })),
              ]}
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
      <Button label={t('actions.save')} onPress={form.handleSubmit((values) => onSubmit(values as ProductFormValues))} />
    </View>
  );
}
