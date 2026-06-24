import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getDesignTokens } from '@/lib/theme/tokens';

type InputProps = TextInputProps & {
  // RN has no ::after; affix renders a trailing adornment (e.g. "€" or a unit) inside the field.
  affix?: string;
};

export function Input({ className, placeholderTextColor, onChangeText, multiline, affix, ...props }: InputProps) {
  const colorScheme = useColorScheme();
  const tokens = getDesignTokens(colorScheme);

  const field = (
    <TextInput
      style={{
        borderWidth: 1,
        borderColor: tokens.input,
        backgroundColor: tokens.background,
        color: tokens.foreground,
        borderRadius: 16,
        paddingLeft: 16,
        // ponytail: fixed right padding leaves room for short affixes (€, unit codes)
        paddingRight: affix ? 48 : 16,
        paddingVertical: 12,
        fontSize: 16,
        minHeight: multiline ? 96 : undefined,
        textAlignVertical: multiline ? 'top' : 'center',
      }}
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
      <Text
        pointerEvents="none"
        style={{ position: 'absolute', right: 16, color: tokens.inputPlaceholder, fontSize: 16 }}
      >
        {affix}
      </Text>
    </View>
  );
}
