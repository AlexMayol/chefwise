import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { VariableContextProvider } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AppDatabaseProvider } from '@/lib/db/provider';
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
  const themeName = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <VariableContextProvider value={getDesignTokenVariables(themeName)}>
      <ThemeProvider value={themeName === 'dark' ? DarkTheme : DefaultTheme}>
        <AppDatabaseProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="products/new" options={{ title: '' }} />
            <Stack.Screen name="products/[productId]" options={{ title: '' }} />
            <Stack.Screen name="markets/new" options={{ title: '' }} />
            <Stack.Screen name="markets/[marketId]" options={{ title: '' }} />
            <Stack.Screen name="recipes/new" options={{ title: '' }} />
            <Stack.Screen name="recipes/[recipeId]" options={{ title: '' }} />
            <Stack.Screen name="shopping/new" options={{ title: '' }} />
            <Stack.Screen name="shopping/[shoppingListId]" options={{ title: '' }} />
          </Stack>
          <PortalHost />
        </AppDatabaseProvider>
      </ThemeProvider>
    </VariableContextProvider>
  );
}
