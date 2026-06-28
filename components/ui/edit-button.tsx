import { Pencil } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useTranslation } from '@/lib/i18n';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';

// Mirror of BackButton for the header's top-right edit affordance.
export function EditButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const { foreground } = useDesignTokens();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={t('actions.edit')}
      className="size-10 items-center justify-center rounded-full border border-border bg-card active:opacity-70">
      <Pencil size={18} color={foreground} strokeWidth={2.5} />
    </Pressable>
  );
}
