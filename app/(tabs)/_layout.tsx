import { Tabs } from 'expo-router';

import { FloatingTabBar } from '@/components/domain/floating-tab-bar';
import { useTranslation } from '@/lib/i18n';
import { appTabs } from '@/lib/navigation/tabs';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      {appTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t(tab.titleKey),
            href: tab.hidden ? null : undefined,
          }}
        />
      ))}
    </Tabs>
  );
}
