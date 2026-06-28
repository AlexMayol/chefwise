import { Check, X } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { useTranslation } from '@/lib/i18n';
import { getDesignTokens } from '@/lib/theme/tokens';

import { IconButton } from './icon-button';

// Imperative handle every form exposes so a header (or sheet) can drive its submit.
export type FormHandle = { submit: () => void };

type FormScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onCancel(): void;
  onSave(): void;
};

// The shared create/edit form header: a circular X (cancel) on the left, a
// centered title (+ optional subtitle), and a green check (save) on the right.
export function FormScreenHeader({ title, subtitle, onCancel, onSave }: FormScreenHeaderProps) {
  const { t } = useTranslation();
  const tokens = getDesignTokens(useColorScheme());

  return (
    <View className="flex-row items-center justify-between">
      <IconButton accessibilityLabel={t('actions.cancel')} onPress={onCancel}>
        <X size={20} color={tokens.foreground} />
      </IconButton>
      <View className="items-center">
        <Text className="text-lg font-bold text-foreground">{title}</Text>
        {subtitle ? <Text className="text-xs text-muted-foreground">{subtitle}</Text> : null}
      </View>
      <IconButton accessibilityLabel={t('actions.save')} onPress={onSave}>
        <Check size={22} color={tokens.primary} strokeWidth={2.5} />
      </IconButton>
    </View>
  );
}
