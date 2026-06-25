import { useLocalSearchParams } from 'expo-router';

import { FeatureScreen } from '@/components/domain/feature-screen';
import { ProductForm } from '@/components/domain/product-form';
import { useCreateAndNavigateBack } from '@/lib/hooks/use-create-and-back';
import { useProducts } from '@/lib/hooks/use-products';
import { useTranslation } from '@/lib/i18n';

export default function NewProductScreen() {
  const { t } = useTranslation();
  const { create } = useProducts();
  const submit = useCreateAndNavigateBack(create);
  const { categoryId, marketId } = useLocalSearchParams<{ categoryId?: string; marketId?: string }>();

  return (
    <FeatureScreen title={t('products.new')} emoji="🥕" showBack>
      <ProductForm
        isEditing={false}
        initialValues={{ ...(categoryId ? { categoryId } : {}), ...(marketId ? { marketId } : {}) }}
        onSubmit={submit}
      />
    </FeatureScreen>
  );
}
