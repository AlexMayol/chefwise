import { render } from '@testing-library/react-native';

import { EntityAvatar } from '@/components/ui/entity-avatar';

describe('EntityAvatar', () => {
  it('renders the provided emoji when there is no image', async () => {
    const screen = await render(<EntityAvatar emoji="🥕" />);
    expect(screen.getByText('🥕')).toBeTruthy();
  });

  it('falls back to a basket glyph when nothing is provided', async () => {
    const screen = await render(<EntityAvatar />);
    expect(screen.getByText('🛒')).toBeTruthy();
  });
});
