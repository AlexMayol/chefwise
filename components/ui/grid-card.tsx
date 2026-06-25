import { Link, type Href } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';

export type CollectionItem = {
  id: string;
  title: string;
  emoji?: string;
  subtitle?: string;
  meta?: string;
  href?: Href;
  editable?: boolean;
  imageUri?: string;
};

export function GridCard({
  item,
  onPress,
  selected,
}: {
  item: CollectionItem;
  onPress?: () => void;
  // When defined, the card becomes a selectable checkbox (navigation is ignored).
  selected?: boolean;
}) {
  const content = (
    <Card
      className={`flex-1 justify-between p-3 ${item.imageUri || item.emoji ? 'min-h-28' : ''} ${
        selected ? 'border-2 border-primary' : ''
      }`}>
      {selected !== undefined ? (
        <View
          className={`absolute right-2 top-2 z-10 h-6 w-6 items-center justify-center rounded-full border ${
            selected ? 'border-primary bg-primary' : 'border-border bg-card'
          }`}>
          {selected ? <Text className="text-xs font-bold text-primary-foreground">✓</Text> : null}
        </View>
      ) : null}
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} className="mb-2 h-20 w-full rounded-2xl" resizeMode="cover" />
      ) : item.emoji ? (
        <View className="mb-2 h-20 w-full items-center justify-center rounded-2xl bg-muted">
          <Text className="text-3xl">{item.emoji}</Text>
        </View>
      ) : null}
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
      {item.meta ? <Text className="mt-2 text-sm font-bold text-foreground">{item.meta}</Text> : null}
    </Card>
  );

  if (item.href && selected === undefined) {
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
