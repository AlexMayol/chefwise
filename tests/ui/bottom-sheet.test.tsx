import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';

describe('BottomSheet', () => {
  it('renders the gradient scrim and sheet content when visible', async () => {
    const screen = await render(
      <BottomSheet visible onClose={jest.fn()}>
        <Text>Sheet body</Text>
      </BottomSheet>,
    );

    expect(screen.getByTestId('bottom-sheet-scrim')).toBeTruthy();
    expect(screen.getByText('Sheet body')).toBeTruthy();
  });
});
