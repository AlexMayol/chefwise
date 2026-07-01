import { memo, useCallback, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTranslation } from '@/lib/i18n';

type EmojiGroup = {
  titleKey:
    | 'forms.emojiGroups.produce'
    | 'forms.emojiGroups.fruit'
    | 'forms.emojiGroups.meatSeafood'
    | 'forms.emojiGroups.dairyEggs'
    | 'forms.emojiGroups.bakeryGrains'
    | 'forms.emojiGroups.pantryCondiments'
    | 'forms.emojiGroups.preparedMeals'
    | 'forms.emojiGroups.snacks'
    | 'forms.emojiGroups.frozenSweets'
    | 'forms.emojiGroups.drinks'
    | 'forms.emojiGroups.other';
  emojis: string[];
};

// ponytail: curated set covers the common grocery categories; tap to pick. No emoji-keyboard
// dependency. Extend a group when more icons are needed.
export const EMOJI_GROUPS: EmojiGroup[] = [
  {
    titleKey: 'forms.emojiGroups.produce',
    emojis: [
      '🥦', '🥬', '🥒', '🌽', '🥕', '🍅', '🥔', '🧅', '🧄', '🌶️',
      '🫑', '🍆', '🥑', '🍄', '🥗', '🫛', '🫚', '🌰', '🍠', '🫒',
      '🌱', '🍃',
    ],
  },
  {
    titleKey: 'forms.emojiGroups.fruit',
    emojis: [
      '🍎', '🍏', '🍌', '🍊', '🍋', '🍇', '🍓', '🫐', '🍒', '🍑',
      '🥭', '🍍', '🥥', '🥝', '🍈', '🍉', '🍐',
    ],
  },
  {
    titleKey: 'forms.emojiGroups.meatSeafood',
    emojis: ['🥩', '🍗', '🍖', '🥓', '🌭', '🐟', '🦐', '🦀', '🦑', '🦞', '🐙', '🍤', '🍢'],
  },
  {
    titleKey: 'forms.emojiGroups.dairyEggs',
    emojis: ['🧀', '🥚', '🥛', '🧈', '🍦', '🫕'],
  },
  {
    titleKey: 'forms.emojiGroups.bakeryGrains',
    emojis: ['🥖', '🍞', '🥐', '🥨', '🥯', '🫓', '🍚', '🍝', '🌾', '🥣', '🧇'],
  },
  {
    titleKey: 'forms.emojiGroups.pantryCondiments',
    emojis: ['🥫', '🧂', '🍯', '🫙', '🧴', '🥜', '🫘', '🧆'],
  },
  {
    titleKey: 'forms.emojiGroups.preparedMeals',
    emojis: ['🍕', '🍔', '🌮', '🌯', '🥙', '🥪', '🍜', '🍲', '🍣', '🥟', '🍱', '🥡'],
  },
  {
    titleKey: 'forms.emojiGroups.snacks',
    emojis: ['🍿', '🍟'],
  },
  {
    titleKey: 'forms.emojiGroups.frozenSweets',
    emojis: ['🧊', '🍰', '🍪', '🍫', '🍬', '🍩', '🧁'],
  },
  {
    titleKey: 'forms.emojiGroups.drinks',
    emojis: ['🥤', '☕', '🍷', '🍺', '🧃', '🫖', '🧉', '🍵', '🍾', '🥂', '🍸', '💧'],
  },
  {
    titleKey: 'forms.emojiGroups.other',
    emojis: ['🏷️', '🛒', '🧹', '🧼', '🧽', '🧻', '🐾', '🌿', '🍼'],
  },
];

// ponytail: static class strings, no twMerge per cell — twMerge per cell was the lag.
const BASE_CELL = 'h-11 w-11 items-center justify-center rounded-xl border';
const SELECTED_CELL = `${BASE_CELL} border-primary bg-primary/10`;
const UNSELECTED_CELL = `${BASE_CELL} border-border bg-card`;

// Memoized so tapping re-renders only the 2 cells whose `selected` flips, not the whole grid.
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

// Tap-to-pick emoji grid grouped by category; tapping the selected one clears it.
export function EmojiPicker({ value, onChange }: { value?: string | null; onChange(value: string | null): void }) {
  const { t } = useTranslation();
  // Stable onToggle (via ref) keeps memoized cells from re-rendering on every value change.
  const valueRef = useRef(value);
  valueRef.current = value;
  const onToggle = useCallback(
    (emoji: string) => onChange(valueRef.current === emoji ? null : emoji),
    [onChange],
  );

  return (
    <View className="gap-4">
      {EMOJI_GROUPS.map((group) => (
        <View key={group.titleKey} className="gap-2">
          <Text className="text-sm font-semibold text-muted-foreground">{t(group.titleKey)}</Text>
          <View className="flex-row flex-wrap gap-2">
            {group.emojis.map((emoji) => (
              <EmojiCell key={emoji} emoji={emoji} selected={value === emoji} onToggle={onToggle} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
