import { useLocalSearchParams, useRouter } from 'expo-router';

import { FeatureScreen } from '@/components/domain/feature-screen';
import { ProductForm } from '@/components/domain/product-form';
import { useProducts } from '@/lib/hooks/use-products';
import { useTranslation } from '@/lib/i18n';

export default function NewProductScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { create } = useProducts();
  const { categoryId, marketId } = useLocalSearchParams<{ categoryId?: string; marketId?: string }>();

  return (
    <FeatureScreen title={t('products.new')} emoji="🥕" showBack>
      <ProductForm
        isEditing={false}
        initialValues={{ ...(categoryId ? { categoryId } : {}), ...(marketId ? { marketId } : {}) }}
        onSubmit={async (values, initialPrice) => {
          await create(values, initialPrice);
          router.back();
        }}
      />
    </FeatureScreen>
  );
}
