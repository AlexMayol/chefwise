import { useFocusEffect } from 'expo-router';
import { useCallback, useState, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { GridCard, type CollectionItem } from '@/components/ui/grid-card';
import { LoadingState } from '@/components/ui/loading-state';
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
  renderForm(onSaved: () => void, item?: CollectionItem): ReactNode;
  controls?: ReactNode;
  onResetFilters?: () => void;
  activeFilterCount?: number;
  footer?: ReactNode;
  columns?: number;
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
}: CollectionScreenProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | undefined>();
  const rows = chunkGridRows(items, columns);

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
      return closeModal;
    }, []),
  );

  if (isModalVisible) {
    const resolvedModalTitle = typeof modalTitle === 'function' ? modalTitle(selectedItem) : modalTitle;

    return (
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ gap: 16, paddingTop: insets.top + 16, paddingBottom: 32, paddingHorizontal: 20 }}>

          <View className="flex-row items-center justify-between gap-3">
            <Text className="flex-1 text-3xl font-bold tracking-tight text-foreground">{resolvedModalTitle}</Text>
            <Button label={t('actions.cancel')} variant="ghost" size="sm" onPress={closeModal} />
          </View>
          <Card className="gap-4">{renderForm(closeModal, selectedItem)}</Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ gap: 16, paddingTop: insets.top + 16, paddingBottom: 16, paddingHorizontal: 20 }}>

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
          <BottomSheet visible={filtersOpen} onClose={() => setFiltersOpen(false)} bottomInset={insets.bottom}>
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
                <GridCard key={item.id} item={item} onPress={item.editable ? () => openModal(item) : undefined} />
              ))}
              {Array.from({ length: columns - row.length }).map((_, index) => (
                <View key={`spacer-${index}`} className="flex-1" />
              ))}
            </View>
          ))}
        </Animated.View>
      )}

      {footer}
    </ScrollView>
  );
}
