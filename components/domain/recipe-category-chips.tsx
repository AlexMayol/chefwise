import { Pressable, ScrollView, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

export type RecipeChip = {
  key: string;
  label: string;
  emoji?: string;
  count: number;
};

// Horizontally-scrolling single-select filter chips with counts (All / Favorites / categories).
export function RecipeCategoryChips({
  chips,
  value,
  onChange,
}: {
  chips: RecipeChip[];
  value: string;
  onChange(key: string): void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {chips.map((chip) => {
        const selected = chip.key === value;
        return (
          <Pressable
            key={chip.key}
            onPress={() => onChange(chip.key)}
            accessibilityRole="button"
            accessibilityLabel={chip.label}
            className={cn(
              'flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 active:opacity-80',
              selected ? 'border-primary bg-primary' : 'border-border bg-card',
            )}>
            {chip.emoji ? <Text className="text-sm">{chip.emoji}</Text> : null}
            <Text className={cn('text-sm font-medium', selected ? 'text-primary-foreground' : 'text-foreground')}>
              {chip.label}
            </Text>
            <View className={cn('rounded-full px-1.5', selected ? 'bg-primary-foreground/20' : 'bg-muted')}>
              <Text className={cn('text-xs font-semibold', selected ? 'text-primary-foreground' : 'text-muted-foreground')}>
                {chip.count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
