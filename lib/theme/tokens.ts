export type ThemeName = 'light' | 'dark';
type ThemeInput = ThemeName | 'unspecified' | null | undefined;

export type DesignTokens = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  inputPlaceholder: string;
  rating: string;
};

export const designTokens: Record<ThemeName, DesignTokens> = {
  light: {
    background: '#f6f6f3',
    foreground: '#1c1f1d',
    card: '#ffffff',
    cardForeground: '#1c1f1d',
    muted: '#f0f0ec',
    mutedForeground: '#8a8f8a',
    primary: '#2e9e5e',
    primaryForeground: '#ffffff',
    secondary: '#e7f3ec',
    secondaryForeground: '#246b45',
    destructive: '#d1483a',
    destructiveForeground: '#ffffff',
    border: '#e9e9e3',
    input: '#f1f1ec',
    ring: '#2e9e5e',
    inputPlaceholder: '#9aa09a',
    rating: '#f5b50a',
  },
  dark: {
    background: '#141816',
    foreground: '#f1f4f1',
    card: '#1d231f',
    cardForeground: '#f1f4f1',
    muted: '#28302b',
    mutedForeground: '#aab3ac',
    primary: '#4ab877',
    primaryForeground: '#0c100e',
    secondary: '#24382c',
    secondaryForeground: '#d4ead9',
    destructive: '#e2604f',
    destructiveForeground: '#141816',
    border: '#2f3a33',
    input: '#2a332d',
    ring: '#4ab877',
    inputPlaceholder: '#8a948c',
    rating: '#f5c026',
  },
};

export function getDesignTokens(theme: ThemeInput): DesignTokens {
  return designTokens[theme === 'dark' ? 'dark' : 'light'];
}

export function getDesignTokenVariables(theme: ThemeInput): Record<string, string> {
  const tokens = getDesignTokens(theme);

  return {
    '--background': tokens.background,
    '--foreground': tokens.foreground,
    '--card': tokens.card,
    '--card-foreground': tokens.cardForeground,
    '--muted': tokens.muted,
    '--muted-foreground': tokens.mutedForeground,
    '--primary': tokens.primary,
    '--primary-foreground': tokens.primaryForeground,
    '--secondary': tokens.secondary,
    '--secondary-foreground': tokens.secondaryForeground,
    '--destructive': tokens.destructive,
    '--destructive-foreground': tokens.destructiveForeground,
    '--border': tokens.border,
    '--input': tokens.input,
    '--ring': tokens.ring,
    '--input-placeholder': tokens.inputPlaceholder,
    '--rating': tokens.rating,
  };
}
