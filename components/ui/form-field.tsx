import { Text, View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

type FormFieldProps = ViewProps & {
  label: string;
  error?: string;
};

export function FormField({ label, error, className, children, ...props }: FormFieldProps) {
  return (
    <View className={cn('gap-2', className)} {...props}>
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      {children}
      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
    </View>
  );
}
