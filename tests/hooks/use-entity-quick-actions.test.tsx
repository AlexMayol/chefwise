import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';

import { useListingQuickActions } from '@/lib/hooks/use-entity-quick-actions';

function ListingProbe() {
  const actions = useListingQuickActions<{ id: string }>();
  return (
    <>
      <Pressable testID="open" onPress={() => actions.open({ id: 'entity-1' })} />
      <Pressable testID="edit" onPress={actions.beginEdit} />
      <Pressable testID="delete" onPress={() => void actions.remove(async () => undefined, 'entity-1')} />
      <Text testID="menu">{actions.menuVisible ? 'menu' : 'hidden'}</Text>
      <Text testID="edit-sheet">{actions.editVisible ? 'edit' : 'hidden'}</Text>
      <Text testID="error">{actions.deleteError ?? ''}</Text>
    </>
  );
}

describe('useListingQuickActions', () => {
  it('opens the menu, then the edit sheet, then closes on successful delete', async () => {
    const screen = await render(<ListingProbe />);

    fireEvent.press(screen.getByTestId('open'));
    await waitFor(() => expect(screen.getByTestId('menu').props.children).toBe('menu'));

    fireEvent.press(screen.getByTestId('edit'));
    await waitFor(() => expect(screen.getByTestId('edit-sheet').props.children).toBe('edit'));

    fireEvent.press(screen.getByTestId('delete'));
    await waitFor(() => expect(screen.getByTestId('menu').props.children).toBe('hidden'));
  });

  it('surfaces delete-blocked errors without closing', async () => {
    function BlockedProbe() {
      const actions = useListingQuickActions<{ id: string }>();
      return (
        <>
          <Pressable testID="open" onPress={() => actions.open({ id: 'entity-1' })} />
          <Pressable
            testID="delete"
            onPress={() =>
              void actions.remove(async () => {
                throw new Error('blocked');
              }, 'entity-1')
            }
          />
          <Text testID="error">{actions.deleteError ?? ''}</Text>
        </>
      );
    }

    const screen = await render(<BlockedProbe />);
    fireEvent.press(screen.getByTestId('open'));
    fireEvent.press(screen.getByTestId('delete'));

    await waitFor(() => expect(screen.getByTestId('error').props.children).toBeTruthy());
  });
});
