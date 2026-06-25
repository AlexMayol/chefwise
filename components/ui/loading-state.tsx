import { ActivityIndicator, View } from 'react-native';

export function LoadingState() {
  return (
    <View className="items-center justify-center py-16">
      <ActivityIndicator className="text-muted-foreground" />
    </View>
  );
}
