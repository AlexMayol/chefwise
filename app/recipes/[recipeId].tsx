import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteButton } from '@/components/domain/delete-button';
import { FeatureScreen } from '@/components/domain/feature-screen';
import { RecipeCostBreakdown } from '@/components/domain/recipe-cost-breakdown';
import { RecipeProductForm, type RecipeProductFormHandle } from '@/components/domain/recipe-product-form';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { ListRow } from '@/components/ui/list-row';
import { useTranslation } from '@/lib/i18n';
import { useRecipeDetail } from '@/lib/hooks/use-recipes';
import type { RecipeCostResult } from '@/lib/domain/recipes';
import { useProducts } from '@/lib/hooks/use-products';

export default function RecipeDetailScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { recipe, ingredients, addIngredient, calculateCost, cook, remove } = useRecipeDetail(recipeId);
  const { items: products } = useProducts({ sort: 'favorites_first' });
  const [cost, setCost] = useState<RecipeCostResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const addFormRef = useRef<RecipeProductFormHandle>(null);
  const productNamesById = Object.fromEntries(products.map((product) => [product.id, product.name]));

  useEffect(() => {
    void calculateCost().then(setCost);
  }, [calculateCost]);

  return (
    <FeatureScreen title={recipe?.name ?? t('recipes.title')} description={cost?.complete ? t('recipes.totalCost') : t('recipes.incompleteCost')} emoji="🍳" showBack>
      <RecipeCostBreakdown
        totalCost={cost?.totalCost}
        costPerServing={cost?.costPerServing}
        complete={cost?.complete ?? false}
        breakdown={cost?.breakdown}
        productNamesById={productNamesById}
      />
      {ingredients.map((ingredient) => (
        <ListRow key={ingredient.id} title={productNamesById[ingredient.productId] ?? ingredient.productId} subtitle={`${ingredient.quantity} ${ingredient.unit}`} />
      ))}
      <Button label={t('recipes.addIngredient')} variant="secondary" onPress={() => setAddOpen(true)} />
      <View>
        <Button
          label={t('actions.cookRecipe')}
          onPress={() =>
            void cook()
              .then(() => setMessage(t('actions.confirm')))
              .catch(() => setMessage(t('errors.missingPantryItems')))
          }
        />
        {message ? <Text className="mt-2 text-sm text-muted-foreground">{message}</Text> : null}
      </View>
      <DeleteButton onDelete={remove} />

      <BottomSheet visible={addOpen} onClose={() => setAddOpen(false)} bottomInset={insets.bottom}>
        <FormScreenHeader
          title={t('recipes.addIngredient')}
          onCancel={() => setAddOpen(false)}
          onSave={() => addFormRef.current?.submit()}
        />
        <RecipeProductForm
          ref={addFormRef}
          recipeId={recipeId}
          hideSubmit
          onSubmit={async (values) => {
            await addIngredient(values);
            setCost(await calculateCost());
            setAddOpen(false);
          }}
        />
      </BottomSheet>
    </FeatureScreen>
  );
}
