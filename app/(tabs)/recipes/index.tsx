import { CollectionScreen } from '@/components/domain/collection-screen';
import { RecipeForm } from '@/components/domain/recipe-form';
import { useRecipes } from '@/lib/hooks/use-recipes';
import { useTranslation } from '@/lib/i18n';
import type { Href } from 'expo-router';

export default function RecipesScreen() {
  const { t } = useTranslation();
  const { items, create } = useRecipes();

  return (
    <CollectionScreen
      title={t('recipes.title')}
      description={`${t('recipes.manual')} · ${t('recipes.cheapestAvailable')}`}
      addLabel={t('recipes.new')}
      modalTitle={t('recipes.new')}
      items={items.map((recipe) => ({
        id: recipe.id,
        title: recipe.name,
        subtitle: recipe.description ?? t('recipes.incompleteCost'),
        meta: `${recipe.servings}`,
        href: `/recipes/${recipe.id}` as Href,
      }))}
      renderForm={(onSaved) => (
        <RecipeForm
          onSubmit={async (values) => {
            await create(values);
            onSaved();
          }}
        />
      )}
    />
  );
}
