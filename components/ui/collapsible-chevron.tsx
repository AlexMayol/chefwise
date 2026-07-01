import { ChevronUp } from 'lucide-react-native';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { COLLAPSIBLE_DURATION_MS } from '@/components/ui/collapsible';

type CollapsibleChevronProps = {
  expanded: boolean;
  color: string;
  size?: number;
  duration?: number;
};

// Rotates a single chevron to match Collapsible open/close timing.
export function CollapsibleChevron({ expanded, color, size = 18, duration = COLLAPSIBLE_DURATION_MS }: CollapsibleChevronProps) {
  const rotation = useSharedValue(expanded ? 0 : 180);

  useEffect(() => {
    rotation.value = withTiming(expanded ? 0 : 180, { duration });
  }, [duration, expanded, rotation]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={style}>
      <ChevronUp size={size} color={color} />
    </Animated.View>
  );
}
