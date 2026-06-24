import { useRouter } from 'expo-router';

import { RecipeForm } from '@/components/domain/recipe-form';
import { RecipeProductForm } from '@/components/domain/recipe-product-form';
import { FeatureScreen } from '@/components/domain/feature-screen';
import { useRecipes } from '@/lib/hooks/use-recipes';
import { useTranslation } from '@/lib/i18n';

export default function NewRecipeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { create } = useRecipes();

  return (
    <FeatureScreen title={t('recipes.new')} description={t('common.offline')} emoji="🍳" showBack>
      <RecipeForm
        onSubmit={async (values) => {
          await create(values);
          router.back();
        }}
      />
      <RecipeProductForm />
    </FeatureScreen>
  );
}
