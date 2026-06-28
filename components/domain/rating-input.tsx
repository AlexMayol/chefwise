import { Pressable, Text, View } from 'react-native';

type RatingInputProps = {
  value?: number | null;
  onChange(value: number): void;
};

export function RatingInput({ value, onChange }: RatingInputProps) {
  return (
    <View className="flex-row gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <Pressable key={rating} className="rounded-full p-1" onPress={() => onChange(rating)}>
          <Text className={rating <= (value ?? 0) ? 'text-xl text-rating' : 'text-xl text-muted-foreground'}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}
