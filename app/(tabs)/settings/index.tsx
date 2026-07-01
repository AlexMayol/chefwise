import Constants from 'expo-constants';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { BackupActions } from '@/components/domain/backup-actions';
import { FeatureScreen } from '@/components/domain/feature-screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useLocale } from '@/lib/hooks/use-locale';
import { useThemePreference, type ThemePreference } from '@/lib/hooks/use-theme-preference';
import { useTranslation, type SupportedLocale } from '@/lib/i18n';

type SettingsSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <View className="gap-3">
      <View className="gap-1">
        <Text className="text-lg font-bold text-card-foreground">{title}</Text>
        <Text className="text-sm leading-5 text-muted-foreground">{description}</Text>
      </View>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const { preference, setPreference } = useThemePreference();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <FeatureScreen title={t('settings.title')} emoji="⚙️">
      <SettingsSection title={t('settings.appearance')} description={t('settings.appearanceDescription')}>
        <View className="gap-2">
          <Text className="text-base font-semibold text-card-foreground">{t('settings.theme')}</Text>
          <SegmentedControl<ThemePreference>
            value={preference}
            onChange={(value) => void setPreference(value)}
            options={[
              { label: t('settings.themeSystem'), value: 'system' },
              { label: t('settings.themeLight'), value: 'light' },
              { label: t('settings.themeDark'), value: 'dark' },
            ]}
          />
        </View>
      </SettingsSection>

      <SettingsSection title={t('settings.language')} description={t('settings.languageDescription')}>
        <SegmentedControl<SupportedLocale>
          value={locale}
          onChange={(value) => void setLocale(value)}
          options={[
            { label: t('settings.english'), value: 'en' },
            { label: t('settings.spanish'), value: 'es' },
          ]}
        />
      </SettingsSection>

      <SettingsSection title={t('settings.localData')} description={t('settings.localDataDescription')}>
        <BackupActions />
      </SettingsSection>

      <View className="border-t border-border pt-1">
        <Text className="text-sm text-muted-foreground">{t('common.version')}: {version}</Text>
      </View>
    </FeatureScreen>
  );
}
