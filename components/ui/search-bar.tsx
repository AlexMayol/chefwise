import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Pressable, View } from 'react-native';


import { useDesignTokens } from '@/lib/hooks/use-design-tokens';

import { Input } from './input';

type SearchBarProps = {
  value: string;
  onChangeText(value: string): void;
  placeholder: string;
  // When provided, renders the trailing filter button.
  onFilter?: () => void;
  filterActive?: boolean;
  filterLabel?: string;
};

// Search field with a leading magnifier and an optional trailing filter button.
// Shared by the products / categories / markets lists.
export function SearchBar({ value, onChangeText, placeholder, onFilter, filterActive, filterLabel }: SearchBarProps) {
  const tokens = useDesignTokens();

  return (
    <View className="flex-row items-center gap-2">
      <View className="flex-1 justify-center">
        <View pointerEvents="none" className="absolute bottom-0 left-3 top-0 z-10 justify-center">
          <Search size={18} color={tokens.mutedForeground} />
        </View>
        <Input
          className="pl-10"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      {onFilter ? (
        <Pressable
          accessibilityLabel={filterLabel}
          className="size-12 items-center justify-center rounded-xl border border-border bg-card active:opacity-70"
          onPress={onFilter}>
          <SlidersHorizontal size={20} color={filterActive ? tokens.primary : tokens.foreground} />
        </Pressable>
      ) : null}
    </View>
  );
}
