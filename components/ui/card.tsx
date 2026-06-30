import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export function Card({ className, style, ...props }: ViewProps) {
  return <View className={cn('rounded-2xl border border-border bg-card p-5', className)} style={style} {...props} />;
}
