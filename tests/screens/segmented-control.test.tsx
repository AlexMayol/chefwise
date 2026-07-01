import { fireEvent, render } from '@testing-library/react-native';

import { SegmentedControl } from '@/components/ui/segmented-control';

const options = [
  { label: 'g', value: 'g' },
  { label: 'kg', value: 'kg' },
  { label: 'unit', value: 'unit' },
];

describe('SegmentedControl', () => {
  it('renders every option label', async () => {
    const { getByText } = await render(<SegmentedControl value="g" options={options} onChange={jest.fn()} />);
    for (const option of options) expect(getByText(option.label)).toBeTruthy();
  });

  it('calls onChange with the pressed value', async () => {
    const onChange = jest.fn();
    const { getByRole } = await render(<SegmentedControl value="g" options={options} onChange={onChange} />);
    fireEvent.press(getByRole('button', { name: 'kg' }));
    expect(onChange).toHaveBeenCalledWith('kg');
  });

  it('exposes the active segment as selected for a11y', async () => {
    const { getByRole } = await render(<SegmentedControl value="kg" options={options} onChange={jest.fn()} />);
    expect(getByRole('button', { name: 'kg' }).props.accessibilityState?.selected).toBe(true);
    expect(getByRole('button', { name: 'g' }).props.accessibilityState?.selected).toBe(false);
  });
});
