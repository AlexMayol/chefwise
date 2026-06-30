import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { FormScreenHeader } from '@/components/ui/form-screen-header';

type EntityEditSheetProps = {
  visible: boolean;
  onClose(): void;
  bottomInset: number;
  title: string;
  onSave(): void;
  children: ReactNode;
};

export function EntityEditSheet({ visible, onClose, bottomInset, title, onSave, children }: EntityEditSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} bottomInset={bottomInset}>
      <View className="flex-1 gap-4">
        <FormScreenHeader title={title} onCancel={onClose} onSave={onSave} />
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
