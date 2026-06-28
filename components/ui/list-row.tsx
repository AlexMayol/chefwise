import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View, type PressableProps } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { elevation } from '@/lib/theme/elevation';
import { getDesignTokens } from '@/lib/theme/tokens';
import { cn } from '@/lib/utils';

type ListRowProps = PressableProps & {
  title: string;
  subtitle?: string;
  meta?: string;
  // Show a trailing chevron to signal the row navigates somewhere.
  chevron?: boolean;
};

export function ListRow({ title, subtitle, meta, chevron, className, style, ...props }: ListRowProps) {
  const tokens = getDesignTokens(useColorScheme());

  return (
    <Pressable className={cn('rounded-2xl border border-border bg-card p-4 active:opacity-90', className)} style={[elevation.card, style as object]} {...props}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold text-card-foreground">{title}</Text>
          {subtitle ? <Text className="text-sm text-muted-foreground">{subtitle}</Text> : null}
        </View>
        {meta ? <Text className="text-sm font-semibold text-primary">{meta}</Text> : null}
        {chevron ? <ChevronRight size={18} color={tokens.mutedForeground} /> : null}
      </View>
    </Pressable>
  );
}
