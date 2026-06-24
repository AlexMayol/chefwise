import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

type DeleteButtonProps = {
  onDelete(): Promise<void>;
};

// Deletes an entity then navigates back. If the DB rejects with ON DELETE RESTRICT
// (the record is still referenced), it surfaces the "in use" message instead of crashing.
export function DeleteButton({ onDelete }: DeleteButtonProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    try {
      await onDelete();
      router.back();
    } catch {
      setError(t('errors.deleteBlocked'));
    }
  }

  return (
    <View className="gap-2">
      <Button label={t('actions.delete')} variant="destructive" onPress={() => void handleDelete()} />
      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
    </View>
  );
}
