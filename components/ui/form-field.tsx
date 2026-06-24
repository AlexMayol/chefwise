import { Text, View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

type FormFieldProps = ViewProps & {
  label: string;
  error?: string;
};

export function FormField({ label, error, className, children, ...props }: FormFieldProps) {
  return (
    <View className={cn('gap-2', className)} {...props}>
      <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Text>
      {children}
      {error ? <Text className="text-sm font-medium text-destructive">{error}</Text> : null}
    </View>
  );
}
