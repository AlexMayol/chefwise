import { useRouter } from 'expo-router';
import { useMemo, useRef } from 'react';

import { RecipeForm, type RecipeFormHandle } from '@/components/domain/recipe-form';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { TipCard } from '@/components/ui/tip-card';
import { createId } from '@/lib/db/repositories/base';
import { useRecipes } from '@/lib/hooks/use-recipes';
import { useTranslation } from '@/lib/i18n';

export default function NewRecipeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { createWithIngredients } = useRecipes();
  const formRef = useRef<RecipeFormHandle>(null);
  // Pre-generate the id so the optional image can be saved to images/recipes/{id}.jpg before save.
  const recipeId = useMemo(() => createId('recipe'), []);

  return (
    <ScreenScaffold paddingBottom={32}>
      <FormScreenHeader
        title={t('recipes.new')}
        onCancel={() => router.back()}
        onSave={() => formRef.current?.submit()}
      />
      <RecipeForm
        ref={formRef}
        recipeId={recipeId}
        onSubmit={async (values) => {
          await createWithIngredients(
            {
              id: recipeId,
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
          router.back();
        }}
      />
      <TipCard title={t('common.tip')}>{t('recipes.automaticallyPricedSubtitle')}</TipCard>
    </ScreenScaffold>
  );
}
