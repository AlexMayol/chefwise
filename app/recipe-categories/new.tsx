import { useRouter } from 'expo-router';
import { useRef } from 'react';

import { RecipeCategoryForm, type RecipeCategoryFormHandle } from '@/components/domain/recipe-category-form';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { TipCard } from '@/components/ui/tip-card';
import { useCreateAndNavigateBack } from '@/lib/hooks/use-create-and-back';
import { useRecipeCategories } from '@/lib/hooks/use-recipe-categories';
import { useTranslation } from '@/lib/i18n';

export default function NewRecipeCategoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { create } = useRecipeCategories();
  const submit = useCreateAndNavigateBack(create);
  const formRef = useRef<RecipeCategoryFormHandle>(null);

  return (
    <ScreenScaffold paddingBottom={32}>
      <FormScreenHeader
        title={t('recipeCategories.new')}
        onCancel={() => router.back()}
        onSave={() => formRef.current?.submit()}
      />
      <RecipeCategoryForm ref={formRef} hideSubmit onSubmit={(values) => submit(values)} />
      <TipCard title={t('common.tip')}>{t('recipeCategories.editTip')}</TipCard>
    </ScreenScaffold>
  );
}
