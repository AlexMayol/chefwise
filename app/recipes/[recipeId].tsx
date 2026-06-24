import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FeatureScreen } from '@/components/domain/feature-screen';
import { RecipeCostBreakdown } from '@/components/domain/recipe-cost-breakdown';
import { RecipeProductForm } from '@/components/domain/recipe-product-form';
import { ListRow } from '@/components/ui/list-row';
import { useTranslation } from '@/lib/i18n';
import { useRecipeDetail } from '@/lib/hooks/use-recipes';
import type { RecipeCostResult } from '@/lib/domain/recipes';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useProducts } from '@/lib/hooks/use-products';

export default function RecipeDetailScreen() {
  const { t } = useTranslation();
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { recipe, ingredients, addIngredient, calculateCost, cook } = useRecipeDetail(recipeId);
  const { items: products } = useProducts({ sort: 'favorites_first' });
  const { items: markets } = useMarkets();
  const [cost, setCost] = useState<RecipeCostResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const productNamesById = Object.fromEntries(products.map((product) => [product.id, product.name]));
  const marketNamesById = Object.fromEntries(markets.map((market) => [market.id, market.name]));

  useEffect(() => {
    void calculateCost().then(setCost);
  }, [calculateCost]);

  return (
    <FeatureScreen title={recipe?.name ?? t('recipes.title')} description={cost?.complete ? t('recipes.totalCost') : t('recipes.incompleteCost')}>
      <RecipeCostBreakdown
        totalCost={cost?.totalCost}
        costPerServing={cost?.costPerServing}
        complete={cost?.complete ?? false}
        breakdown={cost?.breakdown}
        productNamesById={productNamesById}
        marketNamesById={marketNamesById}
      />
      {ingredients.map((ingredient) => (
        <ListRow key={ingredient.id} title={productNamesById[ingredient.productId] ?? ingredient.productId} subtitle={`${ingredient.quantity} ${ingredient.unit}`} />
      ))}
      <RecipeProductForm
        recipeId={recipeId}
        onSubmit={async (values) => {
          await addIngredient(values);
          setCost(await calculateCost());
        }}
      />
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
    </FeatureScreen>
  );
}
