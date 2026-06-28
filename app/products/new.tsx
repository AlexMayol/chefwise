import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';

import { ProductForm, type InitialPrice, type ProductFormHandle } from '@/components/domain/product-form';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { TipCard } from '@/components/ui/tip-card';
import type { ProductInput } from '@/lib/db/repositories/products';
import { useProductOffers } from '@/lib/hooks/use-product-offers';
import { useProducts } from '@/lib/hooks/use-products';
import { useTranslation } from '@/lib/i18n';

export default function NewProductScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { create } = useProducts();
  const { createWithPrice } = useProductOffers();
  const { categoryId, marketId } = useLocalSearchParams<{ categoryId?: string; marketId?: string }>();
  const formRef = useRef<ProductFormHandle>(null);

  const submit = async (product: ProductInput, initialPrice?: InitialPrice) => {
    const created = await create(product);
    if (initialPrice) {
      await createWithPrice(
        { productId: created.id, marketId: initialPrice.marketId, brand: null, quantity: 1, unit: initialPrice.priceUnit },
        initialPrice.price,
      );
    }
    router.back();
  };

  const tips = [t('products.tipSkipPrice'), t('products.tipDefaultUnit'), t('products.tipAddMorePrices')];

  return (
    <ScreenScaffold paddingBottom={32}>
      <FormScreenHeader
        title={t('products.new')}
        subtitle={t('products.newSubtitle')}
        onCancel={() => router.back()}
        onSave={() => formRef.current?.submit()}
      />

      <ProductForm
        ref={formRef}
        isEditing={false}
        withInitialPrice
        initialValues={{ ...(categoryId ? { categoryId } : {}), ...(marketId ? { marketId } : {}) }}
        onSubmit={submit}
      />

      <TipCard title={t('common.tips')}>{tips.map((tip) => `• ${tip}`).join('\n')}</TipCard>
    </ScreenScaffold>
  );
}
