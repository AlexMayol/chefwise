import { ScrollView, type ScrollViewProps } from 'react-native';
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

  return (
    <ScrollView
      className={cn('flex-1 bg-background', className)}
      contentContainerStyle={[
        { gap: 16, paddingTop: insets.top + 16, paddingBottom, paddingHorizontal: 20 },
        contentContainerStyle,
      ]}
      {...props}>
      {children}
    </ScrollView>
  );
}
