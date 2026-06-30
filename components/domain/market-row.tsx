import { Link, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { EntityAvatar, LIST_THUMB_SIZE } from '@/components/ui/entity-avatar';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';

export type MarketRowItem = {
  id: string;
  name: string;
  subtitle: string;
  imageUri?: string;
  href: Href;
};

export function MarketRow({ item, onLongPress }: { item: MarketRowItem; onLongPress?: () => void }) {
  const tokens = useDesignTokens();

  return (
    <Link href={item.href} asChild>
      <Pressable
        testID={`market-row-${item.id}`}
        className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 active:opacity-80"
        onLongPress={onLongPress}>
        <EntityAvatar imageUri={item.imageUri} emoji="🏪" size={LIST_THUMB_SIZE} circle />
        <View className="flex-1 gap-0.5">
          <Text className="text-base font-bold text-card-foreground" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-sm text-muted-foreground" numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
        <ChevronRight size={18} color={tokens.mutedForeground} />
      </Pressable>
    </Link>
  );
}
