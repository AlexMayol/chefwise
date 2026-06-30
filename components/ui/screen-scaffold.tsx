import { BottomTabBarHeightContext } from 'expo-router/js-tabs';
import { useContext } from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';

type ScreenScaffoldProps = ScrollViewProps & {
  // Larger bottom pad for modal/sheet-style screens (default 16).
  paddingBottom?: number;
};

// The shared screen shell: a top-safe-area-padded, gapped, horizontally-inset
// ScrollView on the background. Used by feature/detail/collection screens.
export function ScreenScaffold({ paddingBottom = 16, className, contentContainerStyle, children, ...props }: ScreenScaffoldProps) {
  const insets = useSafeAreaInsets();
  // On tab screens the floating tab bar overlays content; reserve its height so the last
  // rows clear it. Undefined (→ 0) on stack screens, which have no tab bar below them.
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;

  return (
    <View className="flex-1">
      <ScrollView
        className={cn('flex-1 bg-background', className)}
        contentContainerStyle={[
          { gap: 16, paddingTop: insets.top + 16, paddingBottom: paddingBottom + tabBarHeight, paddingHorizontal: 20 },
          contentContainerStyle,
        ]}
        {...props}>
        {children}
      </ScrollView>
      {/* Opaque cover so content scrolls under a clean status bar instead of clashing with it. */}
      <View pointerEvents="none" className="bg-background" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top }} />
    </View>
  );
}
