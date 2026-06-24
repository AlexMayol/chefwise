import { useRouter } from 'expo-router';

import { FeatureScreen } from '@/components/domain/feature-screen';
import { ProductForm } from '@/components/domain/product-form';
import { useProducts } from '@/lib/hooks/use-products';
import { useTranslation } from '@/lib/i18n';

export default function NewProductScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { create } = useProducts();

  return (
    <FeatureScreen title={t('products.new')} description={t('common.offline')} emoji="🥕" showBack>
      <ProductForm
        onSubmit={async (values, initialPrice) => {
          await create(values, initialPrice);
          router.back();
        }}
      />
    </FeatureScreen>
  );
}
