import type { ReactNode } from 'react';
import { View } from 'react-native';

import { BackButton } from './back-button';

// Detail-screen top bar: a back button on the left, action buttons on the right.
export function DetailHeader({ children }: { children?: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between">
      <BackButton />
      <View className="flex-row items-center gap-2">{children}</View>
    </View>
  );
}
