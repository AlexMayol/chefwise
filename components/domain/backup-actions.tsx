import { Alert, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { exportBackupToCache, pickAndValidateBackup } from '@/lib/domain/backup-storage';
import { useTranslation } from '@/lib/i18n';
import { useState } from 'react';

export function BackupActions() {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string | null>(null);

  async function handleExport() {
    try {
      await exportBackupToCache({});
      setMessage(t('backup.exportSuccess'));
    } catch {
      setMessage(t('errors.exportFailed'));
    }
  }

  function handleImport() {
    Alert.alert(t('actions.import'), t('backup.confirmImport'), [
      { text: t('actions.cancel'), style: 'cancel' },
      {
        text: t('actions.confirm'),
        style: 'destructive',
        onPress: () =>
          void pickAndValidateBackup()
            .then(() => setMessage(t('backup.importSuccess')))
            .catch(() => setMessage(t('errors.importFailed'))),
      },
    ]);
  }

  return (
    <Card className="gap-3">
      <Button label={t('actions.export')} onPress={() => void handleExport()} />
      <Button label={t('actions.import')} variant="secondary" onPress={handleImport} />
      {message ? <Text className="text-sm text-muted-foreground">{message}</Text> : null}
      <View />
    </Card>
  );
}
