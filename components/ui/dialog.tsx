import { Modal, Text, View } from 'react-native';

import { Button } from './button';
import { Card } from './card';

type DialogProps = {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm(): void;
  onCancel(): void;
};

export function Dialog({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-center bg-black/40 p-6">
        <Card className="gap-4">
          <Text className="text-xl font-bold text-card-foreground">{title}</Text>
          <Text className="text-base text-muted-foreground">{description}</Text>
          <View className="flex-row gap-3">
            <Button className="flex-1" label={cancelLabel} variant="ghost" onPress={onCancel} />
            <Button className="flex-1" label={confirmLabel} variant={destructive ? 'destructive' : 'primary'} onPress={onConfirm} />
          </View>
        </Card>
      </View>
    </Modal>
  );
}
