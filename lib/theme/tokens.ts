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
    background: '#fff8f0',
    foreground: '#241d1a',
    card: '#ffffff',
    cardForeground: '#241d1a',
    muted: '#f0e7dc',
    mutedForeground: '#6d6258',
    primary: '#ef6c28',
    primaryForeground: '#ffffff',
    secondary: '#d7eddf',
    secondaryForeground: '#255338',
    destructive: '#dc2626',
    destructiveForeground: '#ffffff',
    border: '#ded1c2',
    input: '#ded1c2',
    ring: '#ef6c28',
    inputPlaceholder: '#8a7f72',
  },
  dark: {
    background: '#171210',
    foreground: '#fff6e8',
    card: '#221a17',
    cardForeground: '#fff6e8',
    muted: '#332721',
    mutedForeground: '#d8c7b4',
    primary: '#ff8440',
    primaryForeground: '#171210',
    secondary: '#2d5a3f',
    secondaryForeground: '#d7eddf',
    destructive: '#f87171',
    destructiveForeground: '#171210',
    border: '#4a3930',
    input: '#4a3930',
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
