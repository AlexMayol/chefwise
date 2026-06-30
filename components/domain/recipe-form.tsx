import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react-native';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { CreatableSelect } from '@/components/ui/creatable-select';
import { FormField } from '@/components/ui/form-field';
import { type FormHandle } from '@/components/ui/form-screen-header';
import { FormSection } from '@/components/ui/form-section';
import { IconButton } from '@/components/ui/icon-button';
import { SelectInput } from '@/components/ui/select-input';
import { useAppDatabase } from '@/lib/db/provider';
import type { RecipeInput } from '@/lib/db/repositories/recipes';
import { calculateRecipeCost, type RecipeCostPrice } from '@/lib/domain/recipes';
import type { Unit } from '@/lib/domain/units';
import { formatCurrency } from '@/lib/formatting/currency';
import { useCategories } from '@/lib/hooks/use-categories';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { useProductOffers } from '@/lib/hooks/use-product-offers';
import { useProducts } from '@/lib/hooks/use-products';
import { useRecipeCategories } from '@/lib/hooks/use-recipe-categories';
import { useUnitOptions } from '@/lib/hooks/use-translated-options';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';
import { productEmoji } from '@/lib/ui/category-emoji';
import { recipeSchema, type RecipeFormValues } from '@/lib/validation/recipes';

import { DeleteButton } from './delete-button';
import { RecipeCategoryForm } from './recipe-category-form';
import { RecipeImageField } from './recipe-image-field';

export type RecipeFormHandle = FormHandle;

type RecipeFormProps = {
  // Always provided: the create screen pre-generates an id so the image can be saved before
  // the row exists; the edit screen passes the real recipe id.
  recipeId: string;
  initialValues?: Partial<RecipeFormValues>;
  hideSubmit?: boolean;
  onSubmit(values: RecipeFormValues): Promise<void> | void;
  onDelete?(): Promise<void>;
};

export const RecipeForm = forwardRef<RecipeFormHandle, RecipeFormProps>(function RecipeForm(
  { recipeId, initialValues, hideSubmit = false, onSubmit, onDelete },
  ref,
) {
  const { t } = useTranslation();
  const tokens = useDesignTokens();
  const { repositories } = useAppDatabase();
  const { items: products } = useProducts({ sort: 'favorites_first' });
  const { items: productCategories } = useCategories();
  const { items: categories, create: createCategory } = useRecipeCategories();
  const unitOptions = useUnitOptions();

  const form = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      description: '',
      // servings stays undefined by default — it is always optional.
      recipeCategoryId: null,
      isFavorite: false,
      imagePath: null,
      ingredients: [],
      ...initialValues,
    },
  });
  const ingredientFields = useFieldArray({ control: form.control, name: 'ingredients' });

  const submit = form.handleSubmit((values) => onSubmit(values as RecipeFormValues));
  useImperativeHandle(ref, () => ({ submit: () => void submit() }));

  // Latest price of every offer, loaded once — the cost engine picks the cheapest per ingredient.
  const [prices, setPrices] = useState<RecipeCostPrice[]>([]);
  useEffect(() => {
    void repositories.productOffers.listAll().then((offers) =>
      setPrices(
        offers
          .filter((o) => o.normalizedPrice != null && o.normalizedUnit != null && o.observedAt != null)
          .map((o) => ({
            id: o.id,
            offerId: o.id,
            productId: o.productId,
            normalizedPrice: o.normalizedPrice!,
            normalizedUnit: o.normalizedUnit!,
            observedAt: o.observedAt!,
          })),
      ),
    );
  }, [repositories.productOffers]);

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        label: p.name,
        value: p.id,
        emoji: productEmoji(p.categoryId, productCategories),
        imageUri: resolveEntityImageUri(p.bestImagePath) ?? undefined,
      })),
    [products, productCategories],
  );
  // Selecting an ingredient carries over that product's default unit.
  const defaultUnitByProduct = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p.defaultUnit])), [products]);
  const categoryOptions = useMemo(
    () => [
      { label: t('common.uncategorized'), value: '' },
      ...categories.map((c) => ({ label: c.name, value: c.id, emoji: c.emoji ?? undefined })),
    ],
    [categories, t],
  );

  // useWatch (not form.watch) so the live cost re-renders on every keystroke in a
  // useFieldArray row — quantity edits update the total immediately.
  const watched = useWatch({ control: form.control, name: 'ingredients' });
  const servings = Number(useWatch({ control: form.control, name: 'servings' })) || 0;
  const cost = useMemo(
    () =>
      calculateRecipeCost({
        servings,
        // Honor each row's chosen offer (null = cheapest-auto). Skip rows mid-typing (no product or
        // non-positive quantity) so the live preview never feeds quantity 0 to the cost engine
        // (convertQuantity rejects it). Submit still validates quantity > 0.
        ingredients: (watched ?? [])
          .filter((i) => i.productId && Number(i.quantity) > 0)
          .map((i) => ({ productId: i.productId, offerId: i.offerId ?? null, quantity: Number(i.quantity), unit: i.unit as Unit })),
        prices,
      }),
    [servings, watched, prices],
  );

  return (
    <View className="gap-4">
      <FormSection step={1} title={t('forms.basicInformation')}>
        <ControlledInput control={form.control} name="name" label={t('forms.name')} />
        <ControlledInput control={form.control} name="servings" label={t('forms.servings')} keyboardType="decimal-pad" />
        <Controller
          control={form.control}
          name="recipeCategoryId"
          render={({ field }) => (
            <FormField label={t('recipes.category')}>
              <CreatableSelect
                value={field.value ?? undefined}
                options={categoryOptions}
                onChange={(value) => field.onChange(value || null)}
                addLabel={t('recipeCategories.new')}
                emptyLabel={t('recipes.selectCategory')}
                renderCreateForm={(onCreated, formRef) => (
                  <RecipeCategoryForm
                    ref={formRef}
                    hideSubmit
                    onSubmit={async (values) => {
                      const created = await createCategory(values);
                      onCreated(created.id);
                    }}
                  />
                )}
              />
            </FormField>
          )}
        />
        <ControlledInput control={form.control} name="description" label={t('forms.description')} multiline />
        <Controller
          control={form.control}
          name="imagePath"
          render={({ field }) => (
            <FormField label={t('forms.image')}>
              <RecipeImageField recipeId={recipeId} value={field.value} onChange={field.onChange} />
            </FormField>
          )}
        />
      </FormSection>

      <FormSection step={2} title={t('recipes.ingredients')}>
        {ingredientFields.fields.length === 0 ? (
          <Text className="text-sm text-muted-foreground">{t('recipes.noIngredients')}</Text>
        ) : null}
        {ingredientFields.fields.map((item, index) => (
          <View key={item.id} className="gap-3 rounded-2xl border border-border p-3">
            <View className="flex-row items-center gap-2">
              <View className="flex-1">
                <Controller
                  control={form.control}
                  name={`ingredients.${index}.productId`}
                  render={({ field }) => (
                    <SelectInput
                      value={field.value}
                      options={productOptions}
                      onChange={(productId) => {
                        field.onChange(productId);
                        const unit = defaultUnitByProduct[productId];
                        if (unit) form.setValue(`ingredients.${index}.unit`, unit);
                        // Offers are product-specific — reset to cheapest-auto when the product changes.
                        form.setValue(`ingredients.${index}.offerId`, null);
                      }}
                      placeholder={t('recipes.searchProducts')}
                      searchable
                      searchPlaceholder={t('recipes.searchProducts')}
                    />
                  )}
                />
              </View>
              <IconButton accessibilityLabel={t('actions.delete')} onPress={() => ingredientFields.remove(index)}>
                <Trash2 size={18} color={tokens.mutedForeground} />
              </IconButton>
            </View>
            <View className="flex-row gap-3">
              <ControlledInput
                className="flex-1"
                control={form.control}
                name={`ingredients.${index}.quantity`}
                label={t('forms.quantity')}
                keyboardType="decimal-pad"
              />
              <FormField className="flex-1" label={t('forms.unit')}>
                <Controller
                  control={form.control}
                  name={`ingredients.${index}.unit`}
                  render={({ field }) => (
                    <SelectInput value={field.value as Unit} options={unitOptions} onChange={field.onChange} />
                  )}
                />
              </FormField>
            </View>
            <Controller
              control={form.control}
              name={`ingredients.${index}.offerId`}
              render={({ field }) => (
                <IngredientOfferField
                  productId={watched?.[index]?.productId}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </View>
        ))}
        <Button
          label={t('recipes.addIngredient')}
          variant="secondary"
          onPress={() => ingredientFields.append({ productId: '', offerId: null, quantity: 1, unit: 'unit' })}
        />
      </FormSection>

      <FormSection step={3} title={t('recipes.priceSummary')}>
        <View className="gap-1">
          <Text className="text-2xl font-bold text-foreground">
            {cost.totalCost === null ? t('common.missingPrice') : formatCurrency(cost.totalCost)}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {cost.costPerServing === null
              ? t('recipes.estimatedTotalCost')
              : t('recipes.perServing', { price: formatCurrency(cost.costPerServing) })}
          </Text>
          {!cost.complete ? <Text className="text-sm text-destructive">{t('recipes.incompleteCost')}</Text> : null}
        </View>
      </FormSection>

      {hideSubmit ? null : <Button label={t('actions.save')} onPress={() => void submit()} />}
      {onDelete ? <DeleteButton onDelete={onDelete} /> : null}
    </View>
  );
});

// Per-ingredient offer picker. Loads the product's offers and only renders when there is a real
// choice (2+ offers); otherwise the cheapest-auto rule already covers it. Each row mounts its own
// instance so it can call useProductOffers for its own product. Value '' = cheapest-auto (null).
function IngredientOfferField({
  productId,
  value,
  onChange,
}: {
  productId?: string;
  value?: string | null;
  onChange(value: string | null): void;
}) {
  const { t } = useTranslation();
  const { items: offers } = useProductOffers(productId || undefined);

  if (offers.length < 2) {
    return null;
  }

  const options = [
    { label: t('offers.cheapestAuto'), value: '' },
    ...offers.map((offer) => ({
      label: [offer.marketName, offer.brand, `${offer.quantity} ${offer.unit}`, offer.price != null ? formatCurrency(offer.price) : null]
        .filter(Boolean)
        .join(' · '),
      value: offer.id,
      imageUri: resolveEntityImageUri(offer.imagePath) ?? undefined,
    })),
  ];

  return (
    <FormField label={t('offers.title')}>
      <SelectInput value={value ?? ''} options={options} onChange={(next) => onChange(next || null)} />
    </FormField>
  );
}
