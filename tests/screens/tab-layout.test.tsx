jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  const Tabs = ({ children }: { children: React.ReactNode }) => children;
  Tabs.Screen = ({ name }: { name: string }) => <Text>{name}</Text>;

  return { Tabs };
});

jest.mock('expo-symbols', () => ({
  SymbolView: () => null,
}));

jest.mock('@/components/useClientOnlyValue', () => ({
  useClientOnlyValue: (_server: unknown, client: unknown) => client,
}));

jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/lib/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('tab layout', () => {
  it('hides the global native tab header on client renders', () => {
    const TabLayout = require('@/app/(tabs)/_layout').default;
    const element = TabLayout();

    expect(element.props.screenOptions).toEqual(expect.objectContaining({ headerShown: false }));
  });
});
