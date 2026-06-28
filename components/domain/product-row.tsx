import { Link, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';


import { EntityAvatar } from '@/components/ui/entity-avatar';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { cn } from '@/lib/utils';

export type ProductRowItem = {
  id: string;
  name: string;
  imageUri?: string;
  emoji?: string;
  // Optional muted line under the name (e.g. "3 offers").
  subtitle?: string;
  priceLabel: string;
  // Optional muted line under the price (e.g. the cheapest market's name).
  priceMeta?: string;
  hasPrice: boolean;
  isFavorite?: boolean;
  href: Href;
};

// A single product line: thumbnail, name + optional subtitle, price (+ optional
// market) + chevron.
export function ProductRow({ item, separator }: { item: ProductRowItem; separator?: boolean }) {
  const tokens = useDesignTokens();

  return (
    <Link href={item.href} asChild>
      <Pressable className={cn('flex-row items-center gap-3 py-3 active:opacity-70', separator && 'border-t border-border')}>
        <EntityAvatar imageUri={item.imageUri} emoji={item.emoji} size={44} />
        <View className="flex-1 gap-0.5">
          <Text className="text-base font-semibold text-card-foreground" numberOfLines={1}>
            {item.isFavorite ? '★ ' : ''}
            {item.name}
          </Text>
          {item.subtitle ? <Text className="text-xs text-muted-foreground">{item.subtitle}</Text> : null}
        </View>
        <View className="items-end gap-0.5">
          <Text className={cn('text-sm', item.hasPrice ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
            {item.priceLabel}
          </Text>
          {item.priceMeta ? <Text className="text-xs text-muted-foreground">{item.priceMeta}</Text> : null}
        </View>
        <ChevronRight size={18} color={tokens.mutedForeground} />
      </Pressable>
    </Link>
  );
}
