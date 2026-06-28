import { CreatableSelect } from '@/components/ui/creatable-select';
import { useCategories } from '@/lib/hooks/use-categories';
import { useTranslation } from '@/lib/i18n';

import { CategoryForm } from './category-form';

type CategorySelectProps = {
  value?: string | null;
  onChange(value: string | null): void;
};

// Category picker with an "Uncategorized" option (mapped to null) and an inline
// "create category" drawer.
export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { t } = useTranslation();
  const { items: categories, create } = useCategories();

  return (
    <CreatableSelect
      value={value ?? 'uncategorized'}
      onChange={(next) => onChange(next === 'uncategorized' ? null : next)}
      options={[
        { label: t('common.uncategorized'), value: 'uncategorized' },
        ...categories.map((category) => ({
          label: category.description ? `${category.description}  ${category.name}` : category.name,
          value: category.id,
        })),
      ]}
      addLabel={t('categories.new')}
      renderCreateForm={(onCreated, formRef) => (
        <CategoryForm
          ref={formRef}
          hideSubmit
          onSubmit={async (values) => {
            const category = await create(values);
            onCreated(category.id);
          }}
        />
      )}
    />
  );
}
