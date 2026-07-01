import { memo, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Modal, PanResponder, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
type BottomSheetProps = {
  visible: boolean;
  onClose(): void;
  bottomInset?: number;
  // Sheets are draggable-to-resize by default (fixed height + drag handle), which
  // suits tall forms. Pass `resizable={false}` for short menus/selects/filters
  // that should just hug their content.
  resizable?: boolean;
  children: ReactNode;
};

const SCRIM_OPACITY = 0.4;
const SCRIM_FADE_DURATION = 250;
const SHEET_SLIDE_DURATION = 300;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const BottomSheetScrim = memo(function BottomSheetScrim() {
  return (
    <View
      testID="bottom-sheet-scrim"
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(0, 0, 0, ${SCRIM_OPACITY})` }]}
    />
  );
});

type BottomSheetModalProps = {
  visible: boolean;
  onClose(): void;
  children: ReactNode;
};

function BottomSheetModal({ visible, onClose, children }: BottomSheetModalProps) {
  const [rendered, setRendered] = useState(visible);
  const isMountedRef = useRef(visible);
  const slideDistanceRef = useRef(Dimensions.get('window').height);
  const scrimOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(slideDistanceRef.current);

  const finishClose = useRef(() => {
    isMountedRef.current = false;
    setRendered(false);
  }).current;

  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrimOpacity.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetTranslateY.value }] }));

  useEffect(() => {
    if (visible) {
      const slideDistance = Dimensions.get('window').height;
      slideDistanceRef.current = slideDistance;
      isMountedRef.current = true;
      setRendered(true);

      cancelAnimation(scrimOpacity);
      cancelAnimation(sheetTranslateY);
      scrimOpacity.value = 0;
      sheetTranslateY.value = slideDistance;
      scrimOpacity.value = withTiming(1, { duration: SCRIM_FADE_DURATION });
      sheetTranslateY.value = withTiming(0, { duration: SHEET_SLIDE_DURATION });
      return;
    }

    if (!isMountedRef.current) {
      return;
    }

    const slideDistance = slideDistanceRef.current;
    cancelAnimation(scrimOpacity);
    cancelAnimation(sheetTranslateY);
    scrimOpacity.value = withTiming(0, { duration: SCRIM_FADE_DURATION });
    sheetTranslateY.value = withTiming(
      slideDistance,
      { duration: SHEET_SLIDE_DURATION },
      (finished) => {
        if (finished) {
          runOnJS(finishClose)();
        }
      },
    );
  }, [visible, finishClose, scrimOpacity, sheetTranslateY]);

  if (!rendered) {
    return null;
  }

  return (
    <Modal visible={rendered} transparent animationType="none" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, scrimStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
            <BottomSheetScrim />
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.sheet, sheetStyle]}>{children}</Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export function BottomSheet({ visible, onClose, bottomInset = 0, resizable = true, children }: BottomSheetProps) {
  if (!resizable) {
    return (
      <BottomSheetModal visible={visible} onClose={onClose}>
        <Pressable
          className="rounded-t-3xl border border-border bg-card p-5"
          style={{ paddingBottom: bottomInset + 24 }}
          onPress={(event) => event.stopPropagation()}
        >
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-border" />
          {children}
        </Pressable>
      </BottomSheetModal>
    );
  }

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <ResizableSheetBody bottomInset={bottomInset}>{children}</ResizableSheetBody>
    </BottomSheetModal>
  );
}

function ResizableSheetBody({ bottomInset = 0, children }: Pick<BottomSheetProps, 'bottomInset' | 'children'>) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const maxHeight = screenHeight - insets.top - 24;
  const minHeight = Math.min(260, maxHeight);
  const defaultHeight = clamp(screenHeight * 0.6, minHeight, maxHeight);

  // reanimated shared value → the drag updates layout on the UI thread (no React
  // re-render, no per-frame bridge churn), which keeps it smooth on low-end devices.
  // ponytail: portrait phone app; height isn't recomputed on rotation.
  const height = useSharedValue(defaultHeight);
  const gestureStart = useRef(defaultHeight);
  const bounds = useRef({ min: minHeight, max: maxHeight });
  bounds.current = { min: minHeight, max: maxHeight };

  const pan = useMemo(
    () =>
      PanResponder.create({
        // Claim the touch on start so the parent card Pressable doesn't grab it,
        // and hold it through the drag so nothing steals the responder mid-gesture.
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          gestureStart.current = height.value;
        },
        // Drag up (negative dy) grows the sheet; clamp to [min, max].
        onPanResponderMove: (_, gesture) => {
          height.value = clamp(gestureStart.current - gesture.dy, bounds.current.min, bounds.current.max);
        },
      }),
    [height],
  );

  const animatedStyle = useAnimatedStyle(() => ({ height: height.value }));

  return (
    <Animated.View style={[{ width: '100%' }, animatedStyle]}>
      <Pressable
        className="flex-1 rounded-t-3xl border border-border bg-card"
        onPress={(event) => event.stopPropagation()}
      >
        <View {...pan.panHandlers} className="items-center py-3">
          <View className="h-1.5 w-12 rounded-full bg-border" />
        </View>
        <View className="flex-1 px-5" style={{ paddingBottom: bottomInset + 24 }}>
          {children}
        </View>
      </Pressable>
    </Animated.View>
  );
}
