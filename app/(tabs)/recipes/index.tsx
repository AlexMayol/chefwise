import { CollectionScreen } from '@/components/domain/collection-screen';
import { RecipeForm } from '@/components/domain/recipe-form';
import { useRecipes } from '@/lib/hooks/use-recipes';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { type Href } from 'expo-router';

export default function RecipesScreen() {
  const { t } = useTranslation();
  const { items, loading, create, reload } = useRecipes();

  useReloadOnFocus(reload);

  return (
    <CollectionScreen
      title={t('recipes.title')}
      emoji="🍳"
      addLabel={t('recipes.new')}
      modalTitle={t('recipes.new')}
      loading={loading}
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
