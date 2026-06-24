import { TextInput, useColorScheme, type TextInputProps } from 'react-native';

import { getDesignTokens } from '@/lib/theme/tokens';
import { cn } from '@/lib/utils';

export function Input({ className, placeholderTextColor, ...props }: TextInputProps) {
  const colorScheme = useColorScheme();
  const tokens = getDesignTokens(colorScheme);

  return (
    <TextInput
      className={cn('rounded-xl border border-input bg-background px-3 py-3 text-base text-foreground', className)}
      placeholderTextColor={placeholderTextColor ?? tokens.inputPlaceholder}
      {...props}
    />
  );
}
