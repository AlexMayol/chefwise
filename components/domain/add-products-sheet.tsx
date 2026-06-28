import { useEffect, useRef, useState } from 'react';
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
  // When provided, the sheet runs in "manage" mode: products in `initialSelectedIds`
  // render pre-selected, and de-selecting them calls onRemove on save.
  initialSelectedIds?: Set<string>;
  onRemove?(ids: string[]): Promise<void> | void;
  bottomInset?: number;
};

// Multi-select picker: choose existing products to assign to the current market/category.
export function AddProductsSheet({
  visible,
  onClose,
  products,
  onAdd,
  initialSelectedIds,
  onRemove,
  bottomInset,
}: AddProductsSheetProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const manage = onRemove != null;

  // Seed the selection from the already-added set each time the sheet opens.
  const seeded = useRef(false);
  useEffect(() => {
    if (visible && !seeded.current) {
      setSelected(new Set(initialSelectedIds));
      seeded.current = true;
    } else if (!visible) {
      seeded.current = false;
    }
  }, [visible, initialSelectedIds]);

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

  const initial = initialSelectedIds ?? new Set<string>();
  const added = [...selected].filter((id) => !initial.has(id));
  const removed = [...initial].filter((id) => !selected.has(id));
  const changeCount = added.length + removed.length;

  return (
    <BottomSheet visible={visible} onClose={close} bottomInset={bottomInset}>
      <Text className="mb-3 text-lg font-bold text-card-foreground">{t('products.addExistingTitle')}</Text>
      {products.length > 0 ? (
        <>
          <ScrollView style={{ maxHeight: 420 }} keyboardShouldPersistTaps="handled">
            <ProductGrid products={products} selectedIds={selected} onToggleSelect={toggle} />
          </ScrollView>
          <Button
            className="mt-4"
            label={manage ? t('actions.save') : `${t('actions.add')}${added.length > 0 ? ` (${added.length})` : ''}`}
            disabled={changeCount === 0}
            onPress={async () => {
              if (added.length > 0) await onAdd(added);
              if (removed.length > 0) await onRemove?.(removed);
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
