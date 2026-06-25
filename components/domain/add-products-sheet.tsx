import { useState } from 'react';
import { ScrollView, Text } from 'react-native';

import { ProductGrid } from '@/components/domain/product-grid';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import type { ProductListItem } from '@/lib/db/repositories/products';
import { useTranslation } from '@/lib/i18n';

type AddProductsSheetProps = {
  visible: boolean;
  onClose(): void;
  products: ProductListItem[];
  onAdd(ids: string[]): Promise<void> | void;
  bottomInset?: number;
};

// Multi-select picker: choose existing products to assign to the current market/category.
export function AddProductsSheet({ visible, onClose, products, onAdd, bottomInset }: AddProductsSheetProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const close = () => {
    setSelected(new Set());
    onClose();
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <BottomSheet visible={visible} onClose={close} bottomInset={bottomInset}>
      <Text className="mb-3 text-lg font-bold text-card-foreground">{t('products.addExistingTitle')}</Text>
      {products.length > 0 ? (
        <>
          <ScrollView style={{ maxHeight: 420 }} keyboardShouldPersistTaps="handled">
            <ProductGrid products={products} selectedIds={selected} onToggleSelect={toggle} showMarket={false} />
          </ScrollView>
          <Button
            className="mt-4"
            label={`${t('actions.add')}${selected.size > 0 ? ` (${selected.size})` : ''}`}
            disabled={selected.size === 0}
            onPress={async () => {
              await onAdd([...selected]);
              close();
            }}
          />
        </>
      ) : (
        <EmptyState title={t('common.empty')} />
      )}
    </BottomSheet>
  );
}
