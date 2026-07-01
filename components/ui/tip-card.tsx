import { Lightbulb } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';


import { Collapsible } from '@/components/ui/collapsible';
import { CollapsibleChevron } from '@/components/ui/collapsible-chevron';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';

type TipCardProps = {
  title?: string;
  children: string;
  defaultExpanded?: boolean;
};

// A soft "tip" callout with a lightbulb. Used by the create screens.
export function TipCard({ title, children, defaultExpanded = true }: TipCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const tokens = useDesignTokens();

  return (
    <View className="rounded-2xl bg-secondary">
      <Pressable
        className="flex-row items-center gap-3 p-4 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}>
        <Lightbulb size={18} color={tokens.secondaryForeground} />
        {title ? <Text className="flex-1 text-sm font-bold text-secondary-foreground">{title}</Text> : <View className="flex-1" />}
        <CollapsibleChevron expanded={expanded} color={tokens.secondaryForeground} />
      </Pressable>
      <Collapsible expanded={expanded}>
        <View className="flex-row gap-3 px-4 pb-4">
          <View className="w-[18px]" />
          <Text className="flex-1 text-sm text-secondary-foreground">{children}</Text>
        </View>
      </Collapsible>
    </View>
  );
}
