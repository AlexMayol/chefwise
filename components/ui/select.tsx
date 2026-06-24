import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

type SelectProps<T extends string> = {
  value?: T;
  options: SelectOption<T>[];
  onChange(value: T): void;
};

export function Select<T extends string>({ value, options, onChange }: SelectProps<T>) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            className={cn(
              'rounded-full border border-border px-3 py-2',
              selected ? 'bg-primary' : 'bg-background',
            )}
            onPress={() => onChange(option.value)}
          >
            <Text className={cn('text-sm', selected ? 'text-primary-foreground' : 'text-foreground')}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
