import Colors from '@/constants/Colors';
import { getDesignTokenVariables, getDesignTokens } from '@/lib/theme/tokens';

describe('design tokens', () => {
  it('provides high-contrast semantic colors for dark devices', () => {
    const dark = getDesignTokens('dark');

    expect(dark.background).toBe('#171210');
    expect(dark.foreground).toBe('#fff6e8');
    expect(dark.card).toBe('#221a17');
    expect(dark.cardForeground).toBe('#fff6e8');
    expect(dark.mutedForeground).toBe('#d8c7b4');
  });

  it('exports concrete NativeWind variables for semantic utilities', () => {
    expect(getDesignTokenVariables('dark')).toEqual(
      expect.objectContaining({
        '--background': '#171210',
        '--foreground': '#fff6e8',
        '--card': '#221a17',
        '--card-foreground': '#fff6e8',
        '--input-placeholder': '#d8c7b4',
      }),
    );
  });

  it('keeps navigation template colors aligned with semantic tokens', () => {
    expect(Colors.dark.text).toBe(getDesignTokens('dark').foreground);
    expect(Colors.dark.background).toBe(getDesignTokens('dark').background);
    expect(Colors.dark.tint).toBe(getDesignTokens('dark').primary);
  });
});
