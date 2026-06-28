import { resolveThemeName } from '@/lib/hooks/use-design-tokens';
import { getDesignTokens } from '@/lib/theme/tokens';

describe('useDesignTokens', () => {
  it('resolves explicit light preference over a dark system scheme', () => {
    expect(resolveThemeName('light', 'dark')).toBe('light');
    expect(getDesignTokens(resolveThemeName('light', 'dark')).foreground).toBe('#1c1f1d');
  });

  it('follows the system scheme when preference is system', () => {
    expect(resolveThemeName('system', 'dark')).toBe('dark');
    expect(resolveThemeName('system', 'light')).toBe('light');
  });
});
