import { useEffect, useRef, useState } from 'react';
import { type LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { cn } from '@/lib/utils';

export type SegmentedOption<T extends string = string> = {
  label: string;
  value: T;
};

type SegmentedControlProps<T extends string> = {
  value?: T;
  options: SegmentedOption<T>[];
  onChange(value: T): void;
};

// ponytail: equal-width segments, so the sliding thumb is just translateX = index * segWidth.
const PADDING = 4; // px; matches the track's `p-1`.

export function SegmentedControl<T extends string>({ value, options, onChange }: SegmentedControlProps<T>) {
  const [trackWidth, setTrackWidth] = useState(0);
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const segWidth = trackWidth > 0 ? (trackWidth - PADDING * 2) / options.length : 0;

  const x = useSharedValue(0);
  const settled = useRef(false);

  useEffect(() => {
    if (segWidth <= 0) return;
    const target = index * segWidth;
    // First measure snaps into place; later selections slide.
    x.value = settled.current ? withTiming(target, { duration: 200 }) : target;
    settled.current = true;
  }, [index, segWidth, x]);

  const thumbStyle = useAnimatedStyle(() => ({ width: segWidth, transform: [{ translateX: x.value }] }));

  return (
    <View
      className="flex-row rounded-xl bg-muted p-1"
      onLayout={(event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width)}>
      {segWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          className="rounded-lg bg-card"
          style={[
            {
              position: 'absolute',
              top: PADDING,
              bottom: PADDING,
              left: PADDING,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
              elevation: 1,
            },
            thumbStyle,
          ]}
        />
      )}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className="flex-1 items-center justify-center py-2"
            onPress={() => onChange(option.value)}>
            <Text className={cn('text-sm font-semibold', selected ? 'text-primary' : 'text-muted-foreground')}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
