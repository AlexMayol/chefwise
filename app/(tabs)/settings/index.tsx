import Constants from 'expo-constants';
import { Text, View } from 'react-native';

import { BackupActions } from '@/components/domain/backup-actions';
import { FeatureScreen } from '@/components/domain/feature-screen';
import { Select } from '@/components/ui/select';
import { useLocale } from '@/lib/hooks/use-locale';
import { useTranslation, type SupportedLocale } from '@/lib/i18n';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <FeatureScreen title={t('settings.title')} description={t('common.offline')}>
      <View className="gap-2">
        <Text className="text-base font-semibold text-card-foreground">{t('settings.language')}</Text>
        <Select<SupportedLocale>
          value={locale}
          onChange={(value) => void setLocale(value)}
          options={[
            { label: t('settings.english'), value: 'en' },
            { label: t('settings.spanish'), value: 'es' },
          ]}
        />
      </View>
      <Text className="text-base text-muted-foreground">{t('common.version')}: {version}</Text>
      <BackupActions />
    </FeatureScreen>
  );
}
