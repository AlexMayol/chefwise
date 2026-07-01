import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// Animates its children's height between 0 and their natural height. The inner
// view is absolute so it measures full height even while the parent is clipped
// to 0; animating height every frame lets surrounding content reflow smoothly.
export const COLLAPSIBLE_DURATION_MS = 220;

type CollapsibleProps = {
  expanded: boolean;
  children: ReactNode;
  /** Open/close duration in ms. */
  duration?: number;
};

export function Collapsible({ expanded, children, duration = COLLAPSIBLE_DURATION_MS }: CollapsibleProps) {
  const open = useSharedValue(expanded ? 1 : 0);
  const contentHeight = useSharedValue(0);

  useEffect(() => {
    open.value = withTiming(expanded ? 1 : 0, { duration });
  }, [expanded, duration, open]);

  const style = useAnimatedStyle(() => ({
    height: contentHeight.value * open.value,
    opacity: open.value,
  }));

  return (
    <Animated.View style={[{ overflow: 'hidden' }, style]}>
      <View
        style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
        onLayout={(e) => (contentHeight.value = e.nativeEvent.layout.height)}>
        {children}
      </View>
    </Animated.View>
  );
}
