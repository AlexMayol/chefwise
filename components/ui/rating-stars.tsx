import { Text, View } from 'react-native';

import { cn } from '@/lib/utils';

type RatingStarsProps = {
  value: number;
  // Hide the five-star row and show only the numeric value (e.g. compact rows).
  numberOnly?: boolean;
  className?: string;
};

// Read-only rating display: gold stars + the numeric value (e.g. ★★★★☆ 4.0).
// Editing lives in rating-input.tsx.
export function RatingStars({ value, numberOnly = false, className }: RatingStarsProps) {
  const rounded = Math.round(value);

  return (
    <View className={cn('flex-row items-center gap-1', className)}>
      {numberOnly ? null : (
        <Text className="text-rating text-sm tracking-tight">
          {[1, 2, 3, 4, 5].map((star) => (star <= rounded ? '★' : '☆')).join('')}
        </Text>
      )}
      <Text className="text-xs font-semibold text-muted-foreground">{value.toFixed(1)}</Text>
    </View>
  );
}
