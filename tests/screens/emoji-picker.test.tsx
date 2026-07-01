import { render } from '@testing-library/react-native';

import { EmojiPicker } from '@/components/domain/emoji-picker';

describe('EmojiPicker', () => {
  it('renders grouped section titles', async () => {
    const { getByText } = await render(<EmojiPicker value={null} onChange={jest.fn()} />);

    expect(getByText('Produce')).toBeTruthy();
    expect(getByText('Fruit')).toBeTruthy();
    expect(getByText('Meat & seafood')).toBeTruthy();
    expect(getByText('Other')).toBeTruthy();
  });
});
