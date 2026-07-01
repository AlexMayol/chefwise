import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { TipCard } from '@/components/ui/tip-card';

describe('TipCard', () => {
  it('renders the title and tip body when expanded', async () => {
    const { getByText } = await render(
      <TipCard title="Tips" defaultExpanded>
        Helpful advice here.
      </TipCard>,
    );
    expect(getByText('Tips')).toBeTruthy();
    expect(getByText('Helpful advice here.')).toBeTruthy();
  });

  it('toggles expanded state when the header is pressed', async () => {
    const screen = await render(
      <TipCard title="Tips" defaultExpanded>
        Helpful advice here.
      </TipCard>,
    );
    expect(screen.getByRole('button', { name: 'Tips' }).props.accessibilityState?.expanded).toBe(true);

    await fireEvent.press(screen.getByRole('button', { name: 'Tips' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Tips' }).props.accessibilityState?.expanded).toBe(false),
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Tips' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Tips' }).props.accessibilityState?.expanded).toBe(true),
    );
  });

  it('starts collapsed when defaultExpanded is false', async () => {
    const { getByRole } = await render(
      <TipCard title="Tips" defaultExpanded={false}>
        Helpful advice here.
      </TipCard>,
    );
    expect(getByRole('button', { name: 'Tips' }).props.accessibilityState?.expanded).toBe(false);
  });
});
