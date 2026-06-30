import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { SelectInput } from '@/components/ui/select-input';

const options = [
  { label: 'Apples', value: 'a' },
  { label: 'Baguette', value: 'b' },
  { label: 'Chicken Breast', value: 'c' },
];

describe('searchable SelectInput', () => {
  it('filters the options by name and selects a match', async () => {
    const onChange = jest.fn();
    const screen = await render(
      <SelectInput options={options} onChange={onChange} placeholder="Search products" searchable searchPlaceholder="Search products" />,
    );

    fireEvent.press(screen.getByText('Search products'));
    await waitFor(() => expect(screen.getByText('Baguette')).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText('Search products'), 'chick');
    await waitFor(() => expect(screen.queryByText('Baguette')).toBeNull());
    expect(screen.getByText('Chicken Breast')).toBeTruthy();

    fireEvent.press(screen.getByText('Chicken Breast'));
    expect(onChange).toHaveBeenCalledWith('c');
  });
});
