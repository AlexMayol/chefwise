import { Pressable, Text, View, type PressableProps } from 'react-native';

import { cn } from '@/lib/utils';

type ListRowProps = PressableProps & {
  title: string;
  subtitle?: string;
  meta?: string;
};

export function ListRow({ title, subtitle, meta, className, ...props }: ListRowProps) {
  return (
    <Pressable className={cn('rounded-2xl border border-border bg-card p-4 active:opacity-80', className)} {...props}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold text-card-foreground">{title}</Text>
          {subtitle ? <Text className="text-sm text-muted-foreground">{subtitle}</Text> : null}
        </View>
        {meta ? <Text className="text-sm font-medium text-muted-foreground">{meta}</Text> : null}
      </View>
    </Pressable>
  );
}
