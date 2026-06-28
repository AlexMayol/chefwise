import { useColorScheme } from '@/components/useColorScheme';
import { getDesignTokens, type DesignTokens, type ThemeName } from '@/lib/theme/tokens';

import { useThemePreference, type ThemePreference } from './use-theme-preference';

export function resolveThemeName(
  preference: ThemePreference,
  systemScheme: ReturnType<typeof useColorScheme>,
): ThemeName {
  const resolved = preference === 'system' ? systemScheme : preference;
  return resolved === 'dark' ? 'dark' : 'light';
}

// Lucide icons need JS color props; keep them aligned with NativeWind semantic tokens.
export function useDesignTokens(): DesignTokens {
  const colorScheme = useColorScheme();
  const { preference } = useThemePreference();
  return getDesignTokens(resolveThemeName(preference, colorScheme));
}
