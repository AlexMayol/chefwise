import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

import { BottomSheet } from './bottom-sheet';
import { EntityAvatar } from './entity-avatar';
import type { SelectOption } from './select';

type SelectInputProps<T extends string> = {
  value?: T;
  options: SelectOption<T>[];
  onChange(value: T): void;
  placeholder?: string;
};

// Dropdown-style select: a trigger showing the current choice that opens a
// scrollable option list in a bottom sheet. Scales to many options where the
// pill `Select` gets cramped.
export function SelectInput<T extends string>({ value, options, onChange, placeholder }: SelectInputProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View>
      <Pressable
        className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 active:opacity-80"
        onPress={() => setOpen(true)}
      >
        <View className="flex-1 flex-row items-center gap-3">
          {selected && (selected.imageUri || selected.emoji) ? (
            <EntityAvatar imageUri={selected.imageUri} emoji={selected.emoji} size={24} />
          ) : null}
          <Text className={cn('text-base', selected ? 'text-foreground' : 'text-muted-foreground')}>
            {selected?.label ?? placeholder ?? ''}
          </Text>
        </View>
        <Text className="text-base text-muted-foreground">▾</Text>
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <ScrollView style={{ maxHeight: 360 }}>
          <View className="gap-1">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  className={cn('flex-row items-center gap-3 rounded-2xl px-4 py-3 active:opacity-80', isSelected && 'bg-primary/10')}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.imageUri || option.emoji ? (
                    <EntityAvatar imageUri={option.imageUri} emoji={option.emoji} size={28} />
                  ) : null}
                  <Text className={cn('text-base', isSelected ? 'font-semibold text-primary' : 'text-foreground')}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}
