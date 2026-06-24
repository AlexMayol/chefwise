import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { elevation } from '@/lib/theme/elevation';

type BottomSheetProps = {
  visible: boolean;
  onClose(): void;
  bottomInset?: number;
  children: ReactNode;
};

// Native Modal `animationType="slide"` gives the slide-up animation for free; a
// bottom-anchored card over a scrim makes it read as a bottom sheet.
export function BottomSheet({ visible, onClose, bottomInset = 0, children }: BottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-end"
        // ponytail: neutral scrim; no semantic token exists for modal backdrops
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onPress={onClose}
      >
        <Pressable
          className="rounded-t-3xl border border-border bg-card p-5"
          style={[elevation.card, { paddingBottom: bottomInset + 24 }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-border" />
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
