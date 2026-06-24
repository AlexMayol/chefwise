import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { CategoryInput } from '@/lib/db/repositories/categories';
import { useTranslation } from '@/lib/i18n';
import { categorySchema } from '@/lib/validation/products';

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
  onDelete?(): Promise<void> | void;
}) {
  const { t } = useTranslation();
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialValues ?? { name: '', description: null },
  });

  return (
    <View className="gap-4">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormField label={t('forms.category')} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
            <Input value={field.value} placeholder={t('common.uncategorized')} onChangeText={field.onChange} onBlur={field.onBlur} />
          </FormField>
        )}
      />
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
      <View className="flex-row gap-3">
        {onDelete ? <Button className="flex-1" label={t('actions.delete')} variant="destructive" onPress={() => void onDelete()} /> : null}
        <Button className="flex-1" label={t('actions.save')} onPress={form.handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}
