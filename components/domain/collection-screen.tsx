import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { FormScreenHeader, type FormHandle } from '@/components/ui/form-screen-header';
import { EmptyState } from '@/components/ui/empty-state';
import { GridCard, type CollectionItem } from '@/components/ui/grid-card';
import { LoadingState } from '@/components/ui/loading-state';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { useTranslation } from '@/lib/i18n';
import { chunkGridRows } from '@/lib/ui/grid';

export type { CollectionItem };

type CollectionScreenProps = {
  title: string;
  emoji?: string;
  description?: string;
  items: CollectionItem[];
  loading?: boolean;
  addLabel: string;
  modalTitle: string | ((item?: CollectionItem) => string);
  renderForm(onSaved: () => void, item: CollectionItem | undefined, formRef: RefObject<FormHandle | null>): ReactNode;
  controls?: ReactNode;
  onResetFilters?: () => void;
  activeFilterCount?: number;
  footer?: ReactNode;
  columns?: number;
  // When provided, long-pressing a card enters multi-select mode for bulk delete.
  onDeleteSelected?: (ids: string[]) => Promise<void>;
};

export function CollectionScreen({
  title,
  emoji,
  description,
  items,
  loading = false,
  addLabel,
  modalTitle,
  renderForm,
  controls,
  onResetFilters,
  activeFilterCount = 0,
  footer,
  columns = 2,
  onDeleteSelected,
}: CollectionScreenProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const formRef = useRef<FormHandle>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | undefined>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const rows = chunkGridRows(items, columns);
  const selectionActive = selectedIds.size > 0;

  // Drop ids that no longer exist after a reload (e.g. deleted, or list refiltered).
  useEffect(() => {
    setSelectedIds((current) => {
      if (current.size === 0) {
        return current;
      }
      const present = new Set(items.map((item) => item.id));
      const next = new Set([...current].filter((id) => present.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [items]);

  function clearSelection() {
    setSelectedIds(new Set());
    setConfirmOpen(false);
    setDeleteError(null);
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function confirmDelete() {
    if (!onDeleteSelected) {
      return;
    }
    try {
      await onDeleteSelected([...selectedIds]);
      clearSelection();
    } catch {
      // Some items were FK-blocked; deletable ones are already gone (the prune
      // effect drops them from the selection). Keep the rest selected + show why.
      setConfirmOpen(false);
      setDeleteError(t('errors.deleteBlocked'));
    }
  }

  function closeModal() {
    setIsModalVisible(false);
    setSelectedItem(undefined);
  }

  function openModal(item?: CollectionItem) {
    setSelectedItem(item);
    setIsModalVisible(true);
  }

  useFocusEffect(
    useCallback(() => {
      return () => {
        closeModal();
        clearSelection();
      };
    }, []),
  );

  if (isModalVisible) {
    const resolvedModalTitle = typeof modalTitle === 'function' ? modalTitle(selectedItem) : modalTitle;

    return (
      <ScreenScaffold paddingBottom={32}>
        <FormScreenHeader title={resolvedModalTitle} onCancel={closeModal} onSave={() => formRef.current?.submit()} />
        {renderForm(closeModal, selectedItem, formRef)}
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold>
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          {emoji ? <Text className="text-2xl">{emoji}</Text> : null}
          <Text className="flex-1 text-2xl font-bold tracking-tight text-foreground">{title}</Text>
          <Button label={addLabel} variant="ghost" size="sm" onPress={() => openModal()} />
        </View>
       {description ? <Text className="text-base text-muted-foreground">{description}</Text> : null}
      </View>

      {controls ? (
        <>
          <Button
            className="self-start"
            variant="ghost"
            size="sm"
            label={activeFilterCount > 0 ? `${t('common.filters')} (${activeFilterCount})` : t('common.filters')}
            onPress={() => setFiltersOpen(true)}
          />
          <BottomSheet visible={filtersOpen} onClose={() => setFiltersOpen(false)} bottomInset={insets.bottom} resizable={false}>
            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-foreground">{t('common.filters')}</Text>
                <View className="flex-row items-center gap-1">
                  {onResetFilters ? (
                    <Button
                      label={t('actions.reset')}
                      variant="ghost"
                      size="sm"
                      disabled={activeFilterCount === 0}
                      onPress={onResetFilters}
                    />
                  ) : null}
                  <Button label={t('actions.done')} variant="ghost" size="sm" onPress={() => setFiltersOpen(false)} />
                </View>
              </View>
              {controls}
            </View>
          </BottomSheet>
        </>
      ) : null}

      {loading && items.length === 0 ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState title={t('common.empty')} />
      ) : (
        <Animated.View entering={FadeIn.duration(250)} className="gap-3">
          {rows.map((row, rowIndex) => (
            <View key={row.map((item) => item.id).join('-') || rowIndex} className="flex-row gap-3">
              {row.map((item) => (
                <GridCard
                  key={item.id}
                  item={item}
                  selected={selectionActive ? selectedIds.has(item.id) : undefined}
                  onLongPress={onDeleteSelected ? () => setSelectedIds(new Set([item.id])) : undefined}
                  onPress={
                    selectionActive
                      ? () => toggleSelected(item.id)
                      : item.editable
                        ? () => openModal(item)
                        : undefined
                  }
                />
              ))}
              {Array.from({ length: columns - row.length }).map((_, index) => (
                <View key={`spacer-${index}`} className="flex-1" />
              ))}
            </View>
          ))}
        </Animated.View>
      )}

      {footer}

      {selectionActive ? (
        <View className="gap-2">
          {deleteError ? <Text className="text-sm text-destructive">{deleteError}</Text> : null}
          <View className="flex-row items-center gap-2">
            <Text className="flex-1 text-base font-bold text-foreground">
              {t('selection.selectedCount', { count: selectedIds.size })}
            </Text>
            <Button label={t('actions.cancel')} variant="ghost" size="sm" onPress={clearSelection} />
            <Button label={t('actions.delete')} variant="destructive" size="sm" onPress={() => setConfirmOpen(true)} />
          </View>
        </View>
      ) : null}

      <BottomSheet visible={confirmOpen} onClose={() => setConfirmOpen(false)} bottomInset={insets.bottom} resizable={false}>
        <View className="gap-4">
          <Text className="text-xl font-bold text-foreground">
            {t('selection.confirmDeleteTitle', { count: selectedIds.size })}
          </Text>
          <View className="flex-row justify-end gap-2">
            <Button label={t('actions.cancel')} variant="ghost" size="sm" onPress={() => setConfirmOpen(false)} />
            <Button
              label={t('actions.delete')}
              variant="destructive"
              size="sm"
              onPress={() => void confirmDelete()}
            />
          </View>
        </View>
      </BottomSheet>
    </ScreenScaffold>
  );
}
