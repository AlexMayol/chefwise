import { Link, useFocusEffect, type Href } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useCallback, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { chunkGridRows } from '@/lib/ui/grid';
import { useTranslation } from '@/lib/i18n';

type CollectionItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  href?: Href;
  editable?: boolean;
};

type CollectionScreenProps = {
  title: string;
  description: string;
  items: CollectionItem[];
  addLabel: string;
  modalTitle: string | ((item?: CollectionItem) => string);
  renderForm(onSaved: () => void, item?: CollectionItem): ReactNode;
  controls?: ReactNode;
  footer?: ReactNode;
};

function GridCard({ item, onPress }: { item: CollectionItem; onPress?: () => void }) {
  const content = (
    <Card className="min-h-28 flex-1 justify-between p-3">
      <View className="gap-1">
        <Text className="text-base font-bold text-card-foreground" numberOfLines={2}>
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text className="text-xs text-muted-foreground" numberOfLines={2}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>
      {item.meta ? <Text className="text-xs font-semibold text-muted-foreground">{item.meta}</Text> : null}
    </Card>
  );

  if (item.href) {
    return (
      <Link href={item.href} asChild>
        <Pressable className="flex-1 active:opacity-80">{content}</Pressable>
      </Link>
    );
  }

  if (onPress) {
    return (
      <Pressable className="flex-1 active:opacity-80" onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View className="flex-1">{content}</View>;
}

export function CollectionScreen({
  title,
  description,
  items,
  addLabel,
  modalTitle,
  renderForm,
  controls,
  footer,
}: CollectionScreenProps) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | undefined>();
  const rows = chunkGridRows(items, 3);

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
        <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4 pb-8">
          <View className="flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-foreground">{resolvedModalTitle}</Text>
            <Button label={t('actions.cancel')} variant="ghost" onPress={closeModal} />
          </View>
          <Card className="gap-4">{renderForm(closeModal, selectedItem)}</Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <View className="gap-2">
        <Text className="text-3xl font-bold text-foreground">{title}</Text>
        <Text className="text-base text-muted-foreground">{description}</Text>
      </View>

      {controls}

      {items.length === 0 ? (
        <EmptyState title={t('common.empty')} description={t('common.offline')} />
      ) : (
        <View className="gap-3">
          {rows.map((row, rowIndex) => (
            <View key={row.map((item) => item.id).join('-') || rowIndex} className="flex-row gap-3">
              {row.map((item) => (
                <GridCard key={item.id} item={item} onPress={item.editable ? () => openModal(item) : undefined} />
              ))}
              {Array.from({ length: 3 - row.length }).map((_, index) => (
                <View key={`spacer-${index}`} className="flex-1" />
              ))}
            </View>
          ))}
        </View>
      )}

      <Button label={addLabel} onPress={() => openModal()} />
      {footer}
    </ScrollView>
  );
}
