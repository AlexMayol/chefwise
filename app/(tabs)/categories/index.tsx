import { CategoryForm } from '@/components/domain/category-form';
import { CollectionScreen } from '@/components/domain/collection-screen';
import { useCategories } from '@/lib/hooks/use-categories';
import { useTranslation } from '@/lib/i18n';

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const { items, create, update } = useCategories();

  return (
    <CollectionScreen
      title={t('categories.title')}
      description={t('categories.description')}
      addLabel={t('categories.new')}
      modalTitle={(item) => (item ? t('actions.edit') : t('categories.new'))}
      items={items.map((category) => ({
        id: category.id,
        title: category.name,
        subtitle: t('forms.category'),
        editable: true,
      }))}
      renderForm={(onSaved, selectedCategory) => (
        <CategoryForm
          initialValues={selectedCategory ? { name: selectedCategory.title } : undefined}
          onSubmit={async (values) => {
            if (selectedCategory) {
              await update(selectedCategory.id, values);
            } else {
              await create(values);
            }
            onSaved();
          }}
        />
      )}
    />
  );
}
