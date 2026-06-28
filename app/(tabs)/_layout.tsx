import { SymbolView, unstable_getMaterialSymbolSourceAsync, type SymbolViewProps } from 'expo-symbols';
import { Tabs } from 'expo-router';
import {
  List,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Tag,
  Utensils,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Platform, type ColorValue, type ImageSourcePropType } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useTranslation } from '@/lib/i18n';
import { appTabs, type AppTab } from '@/lib/navigation/tabs';

const ICON_SIZE = 26;
// Render the Material glyph at 3x then downscale so the bitmap stays crisp; tint is applied via <Image>.
const GLYPH_RENDER_SIZE = ICON_SIZE * 3;
const sourceCache = new Map<string, ImageSourcePropType>();

// Android Material Symbols crop when rendered as a SymbolView inside the tab bar, so we render them to an
// image source instead (the documented workaround). iOS SF Symbols work fine as a SymbolView.
function MaterialTabIcon({ symbol, color }: { symbol: string; color: ColorValue }) {
  const [source, setSource] = useState<ImageSourcePropType | null>(() => sourceCache.get(symbol) ?? null);

  useEffect(() => {
    if (sourceCache.has(symbol)) return;
    let active = true;
    const name = symbol as Parameters<typeof unstable_getMaterialSymbolSourceAsync>[0];
    void unstable_getMaterialSymbolSourceAsync(name, GLYPH_RENDER_SIZE, '#ffffff').then((next) => {
      if (next) sourceCache.set(symbol, next);
      if (active && next) setSource(next);
    });
    return () => {
      active = false;
    };
  }, [symbol]);

  if (!source) return null;
  return <Image source={source} style={{ width: ICON_SIZE, height: ICON_SIZE, tintColor: color }} />;
}

// expo-font.renderToImageAsync (used by Material symbols) is unavailable on web, so map to lucide icons.
const webIcons: Record<string, LucideIcon> = {
  shopping_cart: ShoppingCart,
  category: Tag,
  store: Store,
  restaurant: Utensils,
  list: List,
  inventory: Package,
  settings: Settings,
};

function TabIcon({ tab, color }: { tab: AppTab; color: ColorValue }) {
  if (Platform.OS === 'web') {
    const Icon = webIcons[tab.icon.web] ?? List;
    return <Icon size={ICON_SIZE} color={String(color)} />;
  }
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={tab.icon as SymbolViewProps['name']}
        tintColor={String(color)}
        size={ICON_SIZE}
        style={{ width: ICON_SIZE, height: ICON_SIZE }}
      />
    );
  }
  return <MaterialTabIcon symbol={tab.icon.android} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarStyle: {
          zIndex: 0,
          elevation: 0,
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom,
        },
        headerShown: false,
      }}>
      {appTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t(tab.titleKey),
            tabBarIcon: ({ color }) => <TabIcon tab={tab} color={color} />,
            href: tab.hidden ? null : undefined,
          }}
        />
      ))}
    </Tabs>
  );
}
