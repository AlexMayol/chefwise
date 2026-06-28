import { Pressable, Text, View } from 'react-native';

// Section title with an optional trailing action (e.g. "See all"). Used across detail screens.
export function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base font-bold text-card-foreground">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable hitSlop={8} onPress={onAction}>
          <Text className="text-sm font-semibold text-primary">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
