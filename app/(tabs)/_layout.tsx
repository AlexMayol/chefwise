import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useTranslation } from '@/lib/i18n';
import { appTabs, type AppTab } from '@/lib/navigation/tabs';

function TabIcon({ tab, color }: { tab: AppTab; color: ColorValue }) {
  return <SymbolView name={tab.icon as SymbolViewProps['name']} tintColor={String(color)} size={26} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          zIndex: 0,
          elevation: 0,
        },
        headerShown: false,
      }}>
      {appTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: t(tab.titleKey), tabBarIcon: ({ color }) => <TabIcon tab={tab} color={color} /> }}
        />
      ))}
    </Tabs>
  );
}
