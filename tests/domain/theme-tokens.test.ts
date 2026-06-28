import Colors from '@/constants/Colors';
import { getDesignTokenVariables, getDesignTokens } from '@/lib/theme/tokens';

describe('design tokens', () => {
  it('provides high-contrast semantic colors for dark devices', () => {
    const dark = getDesignTokens('dark');

    expect(dark.background).toBe('#141816');
    expect(dark.foreground).toBe('#f1f4f1');
    expect(dark.card).toBe('#1d231f');
    expect(dark.cardForeground).toBe('#f1f4f1');
    expect(dark.mutedForeground).toBe('#aab3ac');
  });

  it('uses a fresh green primary and gold rating accent', () => {
    expect(getDesignTokens('light').primary).toBe('#2e9e5e');
    expect(getDesignTokens('dark').primary).toBe('#4ab877');
    expect(getDesignTokens('light').rating).toBe('#f5b50a');
    expect(getDesignTokens('dark').rating).toBe('#f5c026');
  });

  it('exports concrete NativeWind variables for semantic utilities', () => {
    expect(getDesignTokenVariables('dark')).toEqual(
      expect.objectContaining({
        '--background': '#141816',
        '--foreground': '#f1f4f1',
        '--card': '#1d231f',
        '--card-foreground': '#f1f4f1',
        '--input-placeholder': '#8a948c',
        '--rating': '#f5c026',
      }),
    );
  });

  it('keeps navigation template colors aligned with semantic tokens', () => {
    expect(Colors.dark.text).toBe(getDesignTokens('dark').foreground);
    expect(Colors.dark.background).toBe(getDesignTokens('dark').background);
    expect(Colors.dark.tint).toBe(getDesignTokens('dark').primary);
  });
});
