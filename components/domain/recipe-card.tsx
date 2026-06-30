import { Link, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { EntityAvatar } from '@/components/ui/entity-avatar';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { cn } from '@/lib/utils';

export type RecipeCardItem = {
  id: string;
  name: string;
  imageUri?: string;
  categoryEmoji: string;
  metaLabel: string;
  ingredientEmojis: string[];
  priceLabel: string;
  perServingLabel?: string;
  updatedLabel?: string;
  isFavorite: boolean;
  hasPrice: boolean;
  href: Href;
};

const MAX_EMOJIS = 5;

export function RecipeCard({ item }: { item: RecipeCardItem }) {
  const tokens = useDesignTokens();
  const shown = item.ingredientEmojis.slice(0, MAX_EMOJIS);
  const extra = item.ingredientEmojis.length - shown.length;

  return (
    <Link href={item.href} asChild>
      <Pressable className="active:opacity-90">
        <Card className="flex-row items-center gap-3">
          <EntityAvatar imageUri={item.imageUri} emoji={item.categoryEmoji} size={64} />

          <View className="flex-1 gap-1">
            <Text className="text-base font-bold text-card-foreground" numberOfLines={1}>
              {item.isFavorite ? '★ ' : ''}
              {item.name}
            </Text>
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>
              {item.metaLabel}
            </Text>
            {shown.length > 0 ? (
              <View className="flex-row items-center gap-1">
                {shown.map((emoji, index) => (
                  <Text key={index} className="text-sm">
                    {emoji}
                  </Text>
                ))}
                {extra > 0 ? <Text className="text-xs text-muted-foreground">+{extra}</Text> : null}
              </View>
            ) : null}
            {item.updatedLabel ? <Text className="text-[11px] text-muted-foreground">{item.updatedLabel}</Text> : null}
          </View>

          <View className="items-end gap-0.5">
            <Text className={cn('text-base font-bold', item.hasPrice ? 'text-primary' : 'text-muted-foreground')}>
              {item.priceLabel}
            </Text>
            {item.perServingLabel ? (
              <Text className="text-xs text-muted-foreground">{item.perServingLabel}</Text>
            ) : null}
            <ChevronRight size={16} color={tokens.mutedForeground} />
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}
