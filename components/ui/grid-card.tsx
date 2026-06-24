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

export function GridCard({ item, onPress }: { item: CollectionItem; onPress?: () => void }) {
  const content = (
    <Card className={`flex-1 justify-between p-3 ${item.imageUri || item.emoji ? 'min-h-28' : ''}`}>
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
