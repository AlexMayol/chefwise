import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

import { BottomSheet } from './bottom-sheet';
import { EntityAvatar } from './entity-avatar';
import { Input } from './input';
import type { SelectOption } from './select';

type SelectInputProps<T extends string> = {
  value?: T;
  options: SelectOption<T>[];
  onChange(value: T): void;
  placeholder?: string;
  // Adds a name filter and a drag-to-resize sheet — for long lists like products.
  searchable?: boolean;
  searchPlaceholder?: string;
};

// Dropdown-style select: a trigger showing the current choice that opens a
// scrollable option list in a bottom sheet. Scales to many options where the
// pill `Select` gets cramped; pass `searchable` for long lists.
export function SelectInput<T extends string>({
  value,
  options,
  onChange,
  placeholder,
  searchable = false,
  searchPlaceholder,
}: SelectInputProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((option) => option.value === value);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((option) => option.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const list = (
    <View className="gap-1">
      {visible.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            className={cn('flex-row items-center gap-3 rounded-2xl px-4 py-3 active:opacity-80', isSelected && 'bg-primary/10')}
            onPress={() => {
              onChange(option.value);
              close();
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
  );

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
      {searchable ? (
        <BottomSheet visible={open} onClose={close}>
          <View className="flex-1 gap-3">
            <Input value={query} onChangeText={setQuery} placeholder={searchPlaceholder ?? placeholder} />
            <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
              {list}
            </ScrollView>
          </View>
        </BottomSheet>
      ) : (
        <BottomSheet visible={open} onClose={close} resizable={false}>
          <ScrollView style={{ maxHeight: 360 }}>{list}</ScrollView>
        </BottomSheet>
      )}
    </View>
  );
}
