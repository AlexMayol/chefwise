import { render } from '@testing-library/react-native';

import { CollapsibleChevron } from '@/components/ui/collapsible-chevron';

describe('CollapsibleChevron', () => {
  it('renders when expanded', async () => {
    const { toJSON } = await render(<CollapsibleChevron expanded color="#111" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders when collapsed', async () => {
    const { toJSON } = await render(<CollapsibleChevron expanded={false} color="#111" />);
    expect(toJSON()).toBeTruthy();
  });
});
