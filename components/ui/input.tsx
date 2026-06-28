import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getDesignTokens } from '@/lib/theme/tokens';
import { cn } from '@/lib/utils';

type InputProps = TextInputProps & {
  // RN has no ::after; affix renders a trailing adornment (e.g. "€" or a unit) inside the field.
  affix?: string;
};

export function Input({ className, placeholderTextColor, onChangeText, multiline, affix, ...props }: InputProps) {
  // ponytail: colors come from NativeWind classes so the field tracks its container's theme.
  // Modals render outside the variable-context provider, so a JS-token fill would mismatch the sheet.
  // placeholderTextColor is a prop (not a style) so it still reads from JS tokens — close enough either way.
  const tokens = getDesignTokens(useColorScheme());

  const field = (
    <TextInput
      className={cn(
        'rounded-xl border border-input bg-input px-4 py-3 text-base text-foreground',
        // Reserve room for the trailing affix; a longer one (e.g. "€ / kg") needs more.
        affix && (affix.length > 1 ? 'pr-20' : 'pr-12'),
        multiline && 'min-h-24',
        className,
      )}
      style={{ textAlignVertical: multiline ? 'top' : 'center' }}
      multiline={multiline}
      placeholderTextColor={placeholderTextColor ?? tokens.inputPlaceholder}
      onChangeText={(text) => {
        onChangeText?.(text);
      }}
      {...props}
    />
  );

  if (!affix) {
    return field;
  }

  return (
    <View style={{ justifyContent: 'center' }}>
      {field}
      <Text pointerEvents="none" className="absolute right-4 text-base text-muted-foreground">
        {affix}
      </Text>
    </View>
  );
}
