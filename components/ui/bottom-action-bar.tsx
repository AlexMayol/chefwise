import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Pinned footer for a screen's primary action(s). Rendered as the last flex
// sibling below a flex-1 ScrollView so it stays put while content scrolls above
// it — no overlay, so nothing gets cut off. On tab screens the tab bar already
// covers the safe area, so pass withSafeArea only on full-screen (stack) details.
export function BottomActionBar({ children, withSafeArea = false }: { children: ReactNode; withSafeArea?: boolean }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-border bg-background px-5 pt-3"
      style={{ paddingBottom: (withSafeArea ? insets.bottom : 0) + 12 }}>
      {children}
    </View>
  );
}
