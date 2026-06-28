import { memo, useCallback, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

// ponytail: curated set covers the common grocery categories; tap to pick. No emoji-keyboard
// dependency. Extend the array if more icons are needed.
export const EMOJI_CHOICES = [
  // Produce
  '🥦', '🥬', '🥒', '🌽', '🥕', '🍅', '🥔', '🧅', '🧄', '🌶️',
  '🫑', '🍆', '🥑', '🍄', '🥗', '🫛', '🫚', '🌰',
  // Fruit
  '🍎', '🍏', '🍌', '🍊', '🍋', '🍇', '🍓', '🫐', '🍒', '🍑',
  '🥭', '🍍', '🥥', '🥝', '🍈', '🍉', '🍐',
  // Meat & seafood
  '🥩', '🍗', '🍖', '🥓', '🌭', '🐟', '🦐', '🦀', '🦑', '🦞',
  '🐙', '🍤',
  // Dairy & eggs
  '🧀', '🥚', '🥛', '🧈', '🍦',
  // Bakery & grains
  '🥖', '🍞', '🥐', '🥨', '🥯', '🫓', '🍚', '🍝', '🌾',
  // Pantry & condiments
  '🥫', '🧂', '🍯', '🫙', '🧴', '🥜', '🫘',
  // Frozen & sweets
  '🧊', '🍰', '🍪', '🍫', '🍬', '🍩', '🧁',
  // Drinks
  '🥤', '☕', '🍷', '🍺', '🧃', '🫖', '🧉', '🍵',
  // Other
  '🏷️', '🛒', '🧹', '🧼', '🐾', '🌿',
];

// ponytail: static class strings, no twMerge per cell — 90 twMerge calls per render was the lag.
const BASE_CELL = 'h-11 w-11 items-center justify-center rounded-xl border';
const SELECTED_CELL = `${BASE_CELL} border-primary bg-primary/10`;
const UNSELECTED_CELL = `${BASE_CELL} border-border bg-card`;

// Memoized so tapping re-renders only the 2 cells whose `selected` flips, not all 90.
const EmojiCell = memo(function EmojiCell({
  emoji,
  selected,
  onToggle,
}: {
  emoji: string;
  selected: boolean;
  onToggle(emoji: string): void;
}) {
  return (
    <Pressable onPress={() => onToggle(emoji)} className={selected ? SELECTED_CELL : UNSELECTED_CELL}>
      <Text className="text-2xl">{emoji}</Text>
    </Pressable>
  );
});

// Tap-to-pick emoji grid; tapping the selected one clears it.
export function EmojiPicker({ value, onChange }: { value?: string | null; onChange(value: string | null): void }) {
  // Stable onToggle (via ref) keeps memoized cells from re-rendering on every value change.
  const valueRef = useRef(value);
  valueRef.current = value;
  const onToggle = useCallback(
    (emoji: string) => onChange(valueRef.current === emoji ? null : emoji),
    [onChange],
  );

  return (
    <View className="flex-row flex-wrap gap-2">
      {EMOJI_CHOICES.map((emoji) => (
        <EmojiCell key={emoji} emoji={emoji} selected={value === emoji} onToggle={onToggle} />
      ))}
    </View>
  );
}
