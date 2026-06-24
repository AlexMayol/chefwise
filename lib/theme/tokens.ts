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
};

export const designTokens: Record<ThemeName, DesignTokens> = {
  light: {
    background: '#fbf6ee',
    foreground: '#2a211b',
    card: '#ffffff',
    cardForeground: '#2a211b',
    muted: '#f1e7d9',
    mutedForeground: '#7a6e60',
    primary: '#dd5e22',
    primaryForeground: '#fff8f0',
    secondary: '#e4ede2',
    secondaryForeground: '#2e5238',
    destructive: '#b5462e',
    destructiveForeground: '#fff8f0',
    border: '#e7dac8',
    input: '#deceb9',
    ring: '#dd5e22',
    inputPlaceholder: '#9c8e7c',
  },
  dark: {
    background: '#171210',
    foreground: '#fff6e8',
    card: '#221a17',
    cardForeground: '#fff6e8',
    muted: '#322620',
    mutedForeground: '#d8c7b4',
    primary: '#ff8440',
    primaryForeground: '#171210',
    secondary: '#2c5340',
    secondaryForeground: '#dce9dd',
    destructive: '#e26a4e',
    destructiveForeground: '#171210',
    border: '#45342a',
    input: '#45342a',
    ring: '#ff8440',
    inputPlaceholder: '#d8c7b4',
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
  };
}
