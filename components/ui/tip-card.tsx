import { Lightbulb } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getDesignTokens } from '@/lib/theme/tokens';

// A soft "tip" callout with a lightbulb. Used by the create screens.
export function TipCard({ title, children }: { title?: string; children: string }) {
  const tokens = getDesignTokens(useColorScheme());

  return (
    <View className="flex-row gap-3 rounded-2xl bg-secondary p-4">
      <Lightbulb size={18} color={tokens.secondaryForeground} />
      <View className="flex-1 gap-0.5">
        {title ? <Text className="text-sm font-bold text-secondary-foreground">{title}</Text> : null}
        <Text className="text-sm text-secondary-foreground">{children}</Text>
      </View>
    </View>
  );
}
