import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { VariableContextProvider } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AppDatabaseProvider } from '@/lib/db/provider';
import { resolveThemeName } from '@/lib/hooks/use-design-tokens';
import { useThemePreference } from '@/lib/hooks/use-theme-preference';
import '@/lib/i18n';
import { getDesignTokenVariables } from '@/lib/theme/tokens';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { preference } = useThemePreference();
  const themeName = resolveThemeName(preference, colorScheme);

  return (
    <SafeAreaProvider>
    <VariableContextProvider value={getDesignTokenVariables(themeName)}>
      <ThemeProvider value={themeName === 'dark' ? DarkTheme : DefaultTheme}>
        <AppDatabaseProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="categories/new" options={{ headerShown: false }} />
            <Stack.Screen name="categories/[categoryId]" options={{ headerShown: false }} />
            <Stack.Screen name="products/new" options={{ headerShown: false }} />
            <Stack.Screen name="products/[productId]" options={{ headerShown: false }} />
            <Stack.Screen name="offers/[offerId]" options={{ headerShown: false }} />
            <Stack.Screen name="markets/new" options={{ headerShown: false }} />
            <Stack.Screen name="markets/[marketId]" options={{ headerShown: false }} />
            <Stack.Screen name="recipes/new" options={{ headerShown: false }} />
            <Stack.Screen name="recipes/[recipeId]" options={{ headerShown: false }} />
            <Stack.Screen name="recipe-categories/index" options={{ headerShown: false }} />
            <Stack.Screen name="recipe-categories/new" options={{ headerShown: false }} />
            <Stack.Screen name="recipe-categories/[recipeCategoryId]" options={{ headerShown: false }} />
            <Stack.Screen name="shopping/[shoppingListId]" options={{ headerShown: false }} />
          </Stack>
          <PortalHost />
        </AppDatabaseProvider>
      </ThemeProvider>
    </VariableContextProvider>
    </SafeAreaProvider>
  );
}
