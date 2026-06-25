import { Pencil } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { useTranslation } from '@/lib/i18n';
import { getDesignTokens } from '@/lib/theme/tokens';

// Mirror of BackButton for the header's top-right edit affordance.
export function EditButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const { foreground } = getDesignTokens(useColorScheme());

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={t('actions.edit')}
      className="size-10 items-center justify-center rounded-full bg-muted active:opacity-70">
      <Pencil size={18} color={foreground} strokeWidth={2.5} />
    </Pressable>
  );
}
