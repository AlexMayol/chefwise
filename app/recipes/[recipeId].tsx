import { useLocalSearchParams } from 'expo-router';
import { Star } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { RecipeCostBreakdown } from '@/components/domain/recipe-cost-breakdown';
import { RecipeForm, type RecipeFormHandle } from '@/components/domain/recipe-form';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { Button } from '@/components/ui/button';
import { DetailHeader } from '@/components/ui/detail-header';
import { EditButton } from '@/components/ui/edit-button';
import { EntityAvatar } from '@/components/ui/entity-avatar';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { IconButton } from '@/components/ui/icon-button';
import { ListRow } from '@/components/ui/list-row';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import type { RecipeCostResult } from '@/lib/domain/recipes';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { useProducts } from '@/lib/hooks/use-products';
import { useRecipeCategories } from '@/lib/hooks/use-recipe-categories';
import { useRecipeDetail } from '@/lib/hooks/use-recipes';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';

export default function RecipeDetailScreen() {
  const { t } = useTranslation();
  const tokens = useDesignTokens();
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { recipe, ingredients, save, toggleFavorite, calculateCost, cook, remove } = useRecipeDetail(recipeId);
  const { items: products } = useProducts({ sort: 'favorites_first' });
  const { items: categories } = useRecipeCategories();

  const [cost, setCost] = useState<RecipeCostResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const editFormRef = useRef<RecipeFormHandle>(null);

  const productNamesById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p.name])), [products]);
  const category = categories.find((item) => item.id === recipe?.recipeCategoryId);

  useEffect(() => {
    void calculateCost().then(setCost);
  }, [calculateCost]);

  if (editing && recipe) {
    return (
      <ScreenScaffold paddingBottom={32}>
        <FormScreenHeader
          title={t('recipes.edit')}
          onCancel={() => setEditing(false)}
          onSave={() => editFormRef.current?.submit()}
        />
        <RecipeForm
          ref={editFormRef}
          recipeId={recipeId}
          initialValues={{
            name: recipe.name,
            description: recipe.description ?? '',
            // 0 means "no servings set" — leave the field blank rather than showing 0.
            servings: recipe.servings || undefined,
            recipeCategoryId: recipe.recipeCategoryId,
            imagePath: recipe.imagePath,
            ingredients: ingredients.map((i) => ({
              productId: i.productId,
              offerId: i.offerId,
              quantity: i.quantity,
              unit: i.unit,
            })),
          }}
          onSubmit={async (values) => {
            await save(
              {
                name: values.name,
                description: values.description ?? null,
                servings: values.servings ?? 0,
                recipeCategoryId: values.recipeCategoryId ?? null,
                imagePath: values.imagePath ?? null,
              },
              (values.ingredients ?? []).map((i) => ({
                productId: i.productId,
                offerId: i.offerId ?? null,
                quantity: i.quantity,
                unit: i.unit,
              })),
            );
            setCost(await calculateCost());
            setEditing(false);
          }}
          onDelete={remove}
        />
      </ScreenScaffold>
    );
  }

  const imageUri = resolveEntityImageUri(recipe?.imagePath) ?? undefined;

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <DetailHeader>
          <IconButton accessibilityLabel={t('forms.favorite')} onPress={() => void toggleFavorite()}>
            <Star
              size={20}
              color={recipe?.isFavorite ? tokens.rating : tokens.mutedForeground}
              fill={recipe?.isFavorite ? tokens.rating : 'transparent'}
            />
          </IconButton>
          <EditButton onPress={() => setEditing(true)} />
        </DetailHeader>

        <View className="flex-row items-start gap-4">
          <View className="relative size-20 shrink-0">
            <EntityAvatar imageUri={imageUri} emoji={category?.emoji ?? '🍳'} size={80} />
            {recipe?.isFavorite ? (
              <Animated.View
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(250)}
                // Center the badge on the avatar's bottom edge (the square avatar makes a
                // corner-anchored pill read as off-center).
                className="absolute -bottom-2 left-0 right-0 flex-row justify-center">
                <View className="flex-row items-center gap-1 rounded-full border border-primary bg-background px-2 py-0.5">
                  <Star size={12} color={tokens.primary} fill={tokens.primary} />
                  <Text className="text-xs font-semibold text-primary">{t('forms.favorite')}</Text>
                </View>
              </Animated.View>
            ) : null}
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-2xl font-bold tracking-tight text-foreground">
              {recipe?.name ?? t('recipes.title')}
            </Text>
            <Text className="text-base text-muted-foreground">
              {[
                category ? `${category.emoji ?? ''} ${category.name}` : null,
                recipe && recipe.servings > 0 ? t('recipes.servingsCount', { count: recipe.servings }) : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </View>
        </View>

        <RecipeCostBreakdown
          totalCost={cost?.totalCost}
          costPerServing={cost?.costPerServing}
          complete={cost?.complete ?? false}
          breakdown={cost?.breakdown}
          productNamesById={productNamesById}
        />

        <View className="gap-3">
          <Text className="text-base font-bold text-foreground">{t('recipes.ingredients')}</Text>
          {ingredients.map((ingredient) => (
            <ListRow
              key={ingredient.id}
              title={productNamesById[ingredient.productId] ?? ingredient.productId}
              subtitle={`${ingredient.quantity} ${ingredient.unit}`}
            />
          ))}
        </View>
      </ScreenScaffold>

      <BottomActionBar withSafeArea>
        <Button
          label={t('actions.cookRecipe')}
          onPress={() =>
            void cook()
              .then(() => setMessage(t('actions.confirm')))
              .catch(() => setMessage(t('errors.missingPantryItems')))
          }
        />
        {message ? <Text className="mt-2 text-center text-sm text-muted-foreground">{message}</Text> : null}
      </BottomActionBar>
    </View>
  );
}
