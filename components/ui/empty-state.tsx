import { Text, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-muted px-6 py-10">
      <Text className="text-center text-lg font-semibold text-foreground">{title}</Text>
      {description ? <Text className="text-center text-sm text-muted-foreground">{description}</Text> : null}
    </View>
  );
}
