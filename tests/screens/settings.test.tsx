import { render } from '@testing-library/react-native';

import SettingsScreen from '@/app/(tabs)/settings';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: { version: '1.0.0' },
  },
}));

jest.mock('@/lib/hooks/use-locale', () => ({
  useLocale: () => ({ locale: 'en', setLocale: jest.fn() }),
}));

jest.mock('@/lib/hooks/use-theme-preference', () => ({
  useThemePreference: () => ({ preference: 'system', setPreference: jest.fn() }),
}));

jest.mock('@/lib/db/provider', () => ({
  useAppDatabase: () => ({ db: { serializeAsync: jest.fn() } }),
}));

const translations: Record<string, string> = {
  'actions.export': 'Export',
  'actions.import': 'Import',
  'common.version': 'Version',
  'settings.title': 'Settings',
  'settings.appearance': 'Appearance',
  'settings.appearanceDescription': 'Choose how Chefwise looks on this device.',
  'settings.language': 'Language',
  'settings.languageDescription': 'Pick the app language for labels and controls.',
  'settings.english': 'English',
  'settings.spanish': 'Spanish',
  'settings.theme': 'Theme',
  'settings.themeSystem': 'System',
  'settings.themeLight': 'Light',
  'settings.themeDark': 'Dark',
  'settings.localData': 'Local data',
  'settings.localDataDescription': 'Export a backup or import one to replace this device data.',
  'backup.exportLocalData': 'Export local data',
  'backup.importLocalData': 'Import local data',
};

jest.mock('@/lib/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => translations[key] ?? key }),
}));

describe('settings screen', () => {
  it('shows theme, language, and local data settings', async () => {
    const screen = await render(<SettingsScreen />);

    expect(screen.getByText('Appearance')).toBeTruthy();
    expect(screen.getByText('Theme')).toBeTruthy();
    expect(screen.getByText('System')).toBeTruthy();
    expect(screen.getByText('Light')).toBeTruthy();
    expect(screen.getByText('Dark')).toBeTruthy();

    expect(screen.getByText('Language')).toBeTruthy();
    expect(screen.getByText('English')).toBeTruthy();
    expect(screen.getByText('Spanish')).toBeTruthy();

    expect(screen.getByText('Local data')).toBeTruthy();
    expect(screen.getByText('Export local data')).toBeTruthy();
    expect(screen.getByText('Import local data')).toBeTruthy();
  });
});
