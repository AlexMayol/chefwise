import { Pencil, Trash2 } from 'lucide-react-native';

import { ActionMenu } from '@/components/ui/action-menu';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { useTranslation } from '@/lib/i18n';

type EntityActionMenuSheetProps = {
  visible: boolean;
  onClose(): void;
  bottomInset: number;
  title: string;
  subtitle?: string;
  imageUri?: string;
  emoji?: string;
  editLabel: string;
  deleteError?: string | null;
  onEdit(): void;
  onDelete(): void;
};

export function EntityActionMenuSheet({
  visible,
  onClose,
  bottomInset,
  title,
  subtitle,
  imageUri,
  emoji,
  editLabel,
  deleteError,
  onEdit,
  onDelete,
}: EntityActionMenuSheetProps) {
  const { t } = useTranslation();

  return (
    <BottomSheet visible={visible} onClose={onClose} bottomInset={bottomInset} resizable={false}>
      <ActionMenu
        title={title}
        subtitle={subtitle}
        imageUri={imageUri}
        emoji={emoji}
        error={deleteError}
        actions={[
          { label: editLabel, icon: Pencil, onPress: onEdit },
          { label: t('actions.delete'), icon: Trash2, variant: 'destructive', onPress: onDelete },
        ]}
      />
    </BottomSheet>
  );
}
