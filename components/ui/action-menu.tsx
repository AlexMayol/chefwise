import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { EntityAvatar, LIST_THUMB_SIZE } from '@/components/ui/entity-avatar';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { cn } from '@/lib/utils';

export type ActionMenuItem = {
  label: string;
  icon: LucideIcon;
  variant?: 'default' | 'destructive';
  onPress(): void;
};

type ActionMenuProps = {
  title: string;
  subtitle?: string;
  imageUri?: string;
  emoji?: string;
  actions: ActionMenuItem[];
  error?: string | null;
};

export function ActionMenu({ title, subtitle, imageUri, emoji, actions, error }: ActionMenuProps) {
  const tokens = useDesignTokens();

  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-3 px-1">
        <EntityAvatar imageUri={imageUri} emoji={emoji ?? '📦'} size={LIST_THUMB_SIZE} circle />
        <View className="flex-1 gap-0.5">
          <Text className="text-base font-bold text-card-foreground" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-sm text-muted-foreground" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="overflow-hidden rounded-2xl border border-border">
        {actions.map((action, index) => {
          const destructive = action.variant === 'destructive';
          const Icon = action.icon;
          const iconColor = destructive ? tokens.destructive : tokens.primary;

          return (
            <Pressable
              key={action.label}
              className={cn(
                'flex-row items-center gap-3 bg-card px-4 py-3.5 active:opacity-70',
                index > 0 && 'border-t border-border',
              )}
              onPress={action.onPress}>
              <View
                className={cn(
                  'h-10 w-10 items-center justify-center rounded-full',
                  destructive ? 'bg-destructive/10' : 'bg-secondary',
                )}>
                <Icon size={18} color={iconColor} />
              </View>
              <Text
                className={cn('flex-1 text-base font-semibold', destructive ? 'text-destructive' : 'text-foreground')}
                numberOfLines={1}>
                {action.label}
              </Text>
              {!destructive ? <ChevronRight size={18} color={tokens.mutedForeground} /> : null}
            </Pressable>
          );
        })}
      </View>

      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
    </View>
  );
}
