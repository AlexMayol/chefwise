import { BottomTabBarHeightCallbackContext, type BottomTabBarProps } from 'expo-router/js-tabs';
import { SymbolView, unstable_getMaterialSymbolSourceAsync, type SymbolViewProps } from 'expo-symbols';
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
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  Text,
  View,
  type ColorValue,
  type ImageSourcePropType,
  type LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useTranslation } from '@/lib/i18n';
import { appTabs, type AppTab } from '@/lib/navigation/tabs';

const ICON_SIZE = 22;
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
        name={tab.icon.ios as SymbolViewProps['name']}
        tintColor={String(color)}
        size={ICON_SIZE}
        style={{ width: ICON_SIZE, height: ICON_SIZE }}
      />
    );
  }
  return <MaterialTabIcon symbol={tab.icon.android} color={color} />;
}

// Derived from the constant tab config, so it never changes — compute once at module load.
const VISIBLE_TABS = appTabs.filter((tab) => !tab.hidden);

// Floating rounded pill tab bar (design: components.pen "Bottom Menu"). Renders the visible app tabs.
// Absolutely positioned so the screen content fills the full height and shows through the transparent
// gutter around the pill; `box-none` lets taps in that gutter fall through to the content behind.
// We report our measured height to the navigator's BottomTabBarHeightContext via onLayout so screens
// (ScreenScaffold) can reserve matching bottom clearance — keeping the content above us reachable.
export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const reportHeight = useContext(BottomTabBarHeightCallbackContext);
  const lastReportedHeight = useRef(-1);
  const activeName = state.routes[state.index]?.name;
  const palette = Colors[colorScheme];

  // Only push a *changed* height into the navigator context; redundant reports would
  // re-render every ScreenScaffold consumer. onLayout can fire repeatedly during transitions.
  const handleLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    if (height === lastReportedHeight.current) return;
    lastReportedHeight.current = height;
    reportHeight?.(height);
  };

  return (
    <View
      pointerEvents="box-none"
      onLayout={handleLayout}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: insets.bottom + 8,
      }}>
      <View
        className="flex-row items-center rounded-full border border-border bg-card"
        style={[{ paddingVertical: 6, paddingHorizontal: 14 , elevation: 1 }]}>
        {VISIBLE_TABS.map((tab) => {
          const focused = tab.name === activeName;
          const color = focused ? palette.tabIconSelected : palette.tabIconDefault;
          const route = state.routes.find((r) => r.name === tab.name);
          const onPress = () => {
            if (!route) return;
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(tab.name);
          };
          return (
            <Pressable
              key={tab.name}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              className="flex-1 items-center justify-center"
              style={{ gap: 3 }}>
              <TabIcon tab={tab} color={color} />
              <Text
                className={focused ? 'text-primary' : 'text-muted-foreground'}
                style={{ fontSize: 10, fontWeight: focused ? '600' : '400' }}>
                {t(tab.titleKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
