import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';

import { RecipeCategoryForm, type RecipeCategoryFormHandle } from '@/components/domain/recipe-category-form';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { useRecipeCategories } from '@/lib/hooks/use-recipe-categories';
import { useTranslation } from '@/lib/i18n';

export default function EditRecipeCategoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { recipeCategoryId } = useLocalSearchParams<{ recipeCategoryId: string }>();
  const { items, update, remove } = useRecipeCategories();
  const formRef = useRef<RecipeCategoryFormHandle>(null);

  const category = items.find((item) => item.id === recipeCategoryId);

  return (
    <ScreenScaffold paddingBottom={32}>
      <FormScreenHeader
        title={t('recipeCategories.edit')}
        onCancel={() => router.back()}
        onSave={() => formRef.current?.submit()}
      />
      {category ? (
        <RecipeCategoryForm
          ref={formRef}
          hideSubmit
          initialValues={{ name: category.name, emoji: category.emoji, description: category.description }}
          onSubmit={async (values) => {
            await update(recipeCategoryId, values);
            router.back();
          }}
          onDelete={() => remove(recipeCategoryId)}
        />
      ) : null}
    </ScreenScaffold>
  );
}
