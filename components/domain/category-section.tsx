import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';


import { Card } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';

type CategorySectionProps = {
  title: string;
  emoji: string;
  count: number;
  defaultExpanded?: boolean;
  children: ReactNode;
};

// A collapsible product group: emoji + category name + count, with the product
// rows on a single card below the header.
export function CategorySection({ title, emoji, count, defaultExpanded = true, children }: CategorySectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const tokens = useDesignTokens();

  return (
    <Card className="gap-0 px-4 py-2">
      <Pressable
        className="flex-row items-center gap-3 py-2 active:opacity-70"
        onPress={() => setExpanded((current) => !current)}>
        <Text className="text-xl">{emoji}</Text>
        <Text className="flex-1 text-base font-bold text-card-foreground">{title}</Text>
        <View className="min-w-6 items-center rounded-full bg-muted px-2 py-0.5">
          <Text className="text-xs font-semibold text-muted-foreground">{count}</Text>
        </View>
        {expanded ? (
          <ChevronUp size={18} color={tokens.mutedForeground} />
        ) : (
          <ChevronDown size={18} color={tokens.mutedForeground} />
        )}
      </Pressable>
      <Collapsible expanded={expanded}>{children}</Collapsible>
    </Card>
  );
}
