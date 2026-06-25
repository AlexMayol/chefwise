import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ControlledInput } from '@/components/ui/controlled-input';
import { FormField } from '@/components/ui/form-field';
import type { CategoryInput } from '@/lib/db/repositories/categories';
import { useTranslation } from '@/lib/i18n';
import { categorySchema } from '@/lib/validation/products';

import { DeleteButton } from './delete-button';

// ponytail: curated set covers the common grocery categories; tap to pick. No emoji-keyboard
// dependency. Extend the array if more icons are needed.
const EMOJI_CHOICES = [
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

export function CategoryForm({
  initialValues,
  onSubmit,
  onDelete,
}: {
  initialValues?: CategoryInput;
  onSubmit(values: CategoryInput): Promise<void> | void;
  onDelete?(): Promise<void>;
}) {
  const { t } = useTranslation();
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialValues ?? { name: '', description: null },
  });

  return (
    <View className="gap-4">
      <ControlledInput control={form.control} name="name" label={t('forms.category')} placeholder={t('common.uncategorized')} />
      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormField label={t('forms.emoji')}>
            <View className="flex-row flex-wrap gap-2">
              {EMOJI_CHOICES.map((emoji) => {
                const selected = field.value === emoji;
                return (
                  <Pressable
                    key={emoji}
                    onPress={() => field.onChange(selected ? null : emoji)}
                    className={`h-11 w-11 items-center justify-center rounded-2xl border ${
                      selected ? 'border-primary bg-primary/10' : 'border-border bg-card'
                    }`}>
                    <Text className="text-2xl">{emoji}</Text>
                  </Pressable>
                );
              })}
            </View>
          </FormField>
        )}
      />
      <Button label={t('actions.save')} onPress={form.handleSubmit(onSubmit)} />
      {onDelete ? <DeleteButton onDelete={onDelete} /> : null}
    </View>
  );
}
