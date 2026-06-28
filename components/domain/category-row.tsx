import { Link, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';


import { EntityAvatar } from '@/components/ui/entity-avatar';
import { elevation } from '@/lib/theme/elevation';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';

export type CategoryRowItem = {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  mostTracked?: boolean;
  href: Href;
};

// A category line: emoji tile, name + "N products", optional "Most tracked" badge, chevron.
export function CategoryRow({ item, badgeLabel }: { item: CategoryRowItem; badgeLabel: string }) {
  const tokens = useDesignTokens();

  return (
    <Link href={item.href} asChild>
      <Pressable
        className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 active:opacity-80"
        style={elevation.card}>
        <EntityAvatar emoji={item.emoji} size={44} />
        <View className="flex-1 gap-0.5">
          <Text className="text-base font-bold text-card-foreground" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-sm text-muted-foreground">{item.subtitle}</Text>
        </View>
        {item.mostTracked ? (
          <View className="rounded-full bg-secondary px-2 py-1">
            <Text className="text-xs font-semibold text-secondary-foreground">{badgeLabel}</Text>
          </View>
        ) : null}
        <ChevronRight size={18} color={tokens.mutedForeground} />
      </Pressable>
    </Link>
  );
}
