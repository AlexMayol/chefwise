import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

export type SegmentedTab<T extends string> = {
  key: T;
  label: string;
};

type SegmentedTabsProps<T extends string> = {
  tabs: SegmentedTab<T>[];
  value: T;
  onChange(key: T): void;
};

// Underlined tab strip with local state owned by the parent. No navigation —
// the parent swaps content based on `value`.
export function SegmentedTabs<T extends string>({ tabs, value, onChange }: SegmentedTabsProps<T>) {
  return (
    <View className="flex-row border-b border-border">
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable key={tab.key} className="flex-1 items-center active:opacity-70" onPress={() => onChange(tab.key)}>
            <Text
              className={cn(
                'py-3 text-xs font-bold uppercase tracking-wide',
                active ? 'text-primary' : 'text-muted-foreground',
              )}>
              {tab.label}
            </Text>
            <View className={cn('h-0.5 w-full', active ? 'bg-primary' : 'bg-transparent')} />
          </Pressable>
        );
      })}
    </View>
  );
}
