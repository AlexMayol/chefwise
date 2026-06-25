import { useFocusEffect, type Href } from 'expo-router';
import { useCallback } from 'react';

import { CategoryForm } from '@/components/domain/category-form';
import { CollectionScreen } from '@/components/domain/collection-screen';
import { useCategories } from '@/lib/hooks/use-categories';
import { useTranslation } from '@/lib/i18n';

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const { items, loading, create, reload } = useCategories();

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  return (
    <CollectionScreen
      title={t('categories.title')}
      emoji="🏷️"
      addLabel={t('categories.new')}
      columns={2}
      loading={loading}
      modalTitle={t('categories.new')}
      items={items.map((category) => ({
        id: category.id,
        title: category.name,
        emoji: category.description ?? undefined,
        href: `/categories/${category.id}` as Href,
      }))}
      renderForm={(onSaved) => (
        <CategoryForm
          onSubmit={async (values) => {
            await create(values);
            onSaved();
          }}
        />
      )}
    />
  );
}
