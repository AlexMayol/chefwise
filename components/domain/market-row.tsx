import { Link, type Href } from 'expo-router';
import { Clock, Package, Tag } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { EntityAvatar } from '@/components/ui/entity-avatar';
import { useColorScheme } from '@/components/useColorScheme';
import { elevation } from '@/lib/theme/elevation';
import { getDesignTokens } from '@/lib/theme/tokens';

export type MarketRowItem = {
  id: string;
  name: string;
  address?: string;
  imageUri?: string;
  productCountLabel: string;
  cheapestLabel?: string;
  updatedLabel?: string;
  href: Href;
};

function Meta({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <View className="flex-row items-center gap-1">
      {icon}
      <Text className="text-xs text-muted-foreground" numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

export function MarketRow({ item }: { item: MarketRowItem }) {
  const tokens = getDesignTokens(useColorScheme());

  return (
    <Link href={item.href} asChild>
      <Pressable className="gap-3 rounded-2xl border border-border bg-card p-4 active:opacity-80" style={elevation.card}>
        <View className="flex-row items-center gap-3">
          <EntityAvatar imageUri={item.imageUri} emoji="🏪" size={44} circle />
          <View className="flex-1 gap-0.5">
            <Text className="text-base font-bold text-card-foreground" numberOfLines={1}>
              {item.name}
            </Text>
            {item.address ? (
              <Text className="text-sm text-muted-foreground" numberOfLines={1}>
                {item.address}
              </Text>
            ) : null}
          </View>
          <Meta icon={<Package size={13} color={tokens.primary} />} text={item.productCountLabel} />
        </View>
        {item.cheapestLabel || item.updatedLabel ? (
          <View className="flex-row flex-wrap gap-x-4 gap-y-1">
            {item.cheapestLabel ? <Meta icon={<Tag size={13} color={tokens.mutedForeground} />} text={item.cheapestLabel} /> : null}
            {item.updatedLabel ? <Meta icon={<Clock size={13} color={tokens.mutedForeground} />} text={item.updatedLabel} /> : null}
          </View>
        ) : null}
      </Pressable>
    </Link>
  );
}
