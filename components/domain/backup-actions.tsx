import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { useAppDatabase } from '@/lib/db/provider';
import { exportBackupToCache, pickAndValidateBackup, replaceLocalBackupData } from '@/lib/domain/backup-storage';
import { useTranslation } from '@/lib/i18n';

export function BackupActions() {
  const { t } = useTranslation();
  const { db, importDatabase } = useAppDatabase();
  const [message, setMessage] = useState<string | null>(null);

  async function handleExport() {
    try {
      const { uri } = await exportBackupToCache({ databaseBytes: await db.serializeAsync() });
      // ponytail: lazy-require keeps the native module off the route's import path,
      // so a build without expo-sharing linked degrades instead of crashing the screen.
      const Sharing = await import('expo-sharing');
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/zip', dialogTitle: t('backup.exportLocalData') });
      }
      setMessage(t('backup.exportSuccess'));
    } catch (error) {
      console.warn('[backup] export failed', error);
      setMessage(t('errors.exportFailed'));
    }
  }

  function handleImport() {
    Alert.alert(t('backup.importLocalData'), t('backup.confirmImport'), [
      { text: t('actions.cancel'), style: 'cancel' },
      {
        text: t('actions.confirm'),
        style: 'destructive',
        onPress: () =>
          void importDatabase((beforeReplace) =>
            pickAndValidateBackup((input) => replaceLocalBackupData(input, { beforeReplace })),
          )
            .then((imported) => {
              if (imported) {
                setMessage(t('backup.importSuccess'));
              }
            })
            .catch((error: unknown) => {
              console.warn('[backup] import failed', error);
              setMessage(t('errors.importFailed'));
            }),
      },
    ]);
  }

  return (
    <View className="gap-3">
      <Button label={t('backup.exportLocalData')} onPress={() => void handleExport()} />
      <Button label={t('backup.importLocalData')} variant="secondary" onPress={handleImport} />
      {message ? <Text className="text-sm text-muted-foreground">{message}</Text> : null}
    </View>
  );
}
