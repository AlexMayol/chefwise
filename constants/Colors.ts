import { designTokens } from '@/lib/theme/tokens';

export default {
  light: {
    text: designTokens.light.foreground,
    background: designTokens.light.background,
    tint: designTokens.light.primary,
    tabIconDefault: designTokens.light.mutedForeground,
    tabIconSelected: designTokens.light.primary,
  },
  dark: {
    text: designTokens.dark.foreground,
    background: designTokens.dark.background,
    tint: designTokens.dark.primary,
    tabIconDefault: designTokens.dark.mutedForeground,
    tabIconSelected: designTokens.dark.primary,
  },
};
