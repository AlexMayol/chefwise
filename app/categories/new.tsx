import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { EmojiPicker } from '@/components/domain/emoji-picker';
import { ControlledInput } from '@/components/ui/controlled-input';
import { EntityAvatar } from '@/components/ui/entity-avatar';
import { FormField } from '@/components/ui/form-field';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { FormSection } from '@/components/ui/form-section';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { TipCard } from '@/components/ui/tip-card';
import type { CategoryInput } from '@/lib/db/repositories/categories';
import { useCategories } from '@/lib/hooks/use-categories';
import { useCreateAndNavigateBack } from '@/lib/hooks/use-create-and-back';
import { useTranslation } from '@/lib/i18n';
import { categoryEmoji } from '@/lib/ui/category-emoji';
import { categorySchema } from '@/lib/validation/products';

export default function NewCategoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { create } = useCategories();
  const submit = useCreateAndNavigateBack(create);
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: null },
  });

  const name = form.watch('name');
  const emoji = form.watch('description');

  return (
    <ScreenScaffold paddingBottom={32}>
      <FormScreenHeader
        title={t('categories.new')}
        onCancel={() => router.back()}
        onSave={form.handleSubmit((values) => submit(values))}
      />

      <FormSection step={1} title={t('forms.basicInformation')}>
        <ControlledInput control={form.control} name="name" label={t('forms.name')} />
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormField label={t('categories.iconLabel')}>
              <EmojiPicker value={field.value} onChange={field.onChange} />
            </FormField>
          )}
        />
      </FormSection>

      <View className="flex-row items-center gap-3 rounded-2xl bg-muted p-4">
        <EntityAvatar emoji={emoji || categoryEmoji(name)} size={44} className="bg-card" />
        <View className="flex-1">
          <Text className="text-base font-bold text-card-foreground">{name || t('categories.new')}</Text>
          <Text className="text-sm text-muted-foreground">{t('categories.previewHint')}</Text>
        </View>
      </View>

      <TipCard title={t('common.tips')}>{t('categories.tip')}</TipCard>
    </ScreenScaffold>
  );
}
