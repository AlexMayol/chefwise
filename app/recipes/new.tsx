import { RecipeForm } from '@/components/domain/recipe-form';
import { RecipeProductForm } from '@/components/domain/recipe-product-form';
import { FeatureScreen } from '@/components/domain/feature-screen';
import { useCreateAndNavigateBack } from '@/lib/hooks/use-create-and-back';
import { useRecipes } from '@/lib/hooks/use-recipes';
import { useTranslation } from '@/lib/i18n';

export default function NewRecipeScreen() {
  const { t } = useTranslation();
  const { create } = useRecipes();

  return (
    <FeatureScreen title={t('recipes.new')} emoji="🍳" showBack>
      <RecipeForm onSubmit={useCreateAndNavigateBack(create)} />
      <RecipeProductForm />
    </FeatureScreen>
  );
}
