import { render, waitFor } from '@testing-library/react-native';
import { useFocusEffect } from 'expo-router';
import { Text } from 'react-native';

import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';

jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn((effect: () => void | (() => void)) => {
    effect();
  }),
}));

const useFocusEffectMock = useFocusEffect as jest.MockedFunction<typeof useFocusEffect>;

function Probe({ reloads }: { reloads: (() => Promise<unknown>)[] }) {
  useReloadOnFocus(...reloads);
  return <Text>ready</Text>;
}

describe('useReloadOnFocus', () => {
  beforeEach(() => {
    useFocusEffectMock.mockImplementation((effect) => {
      effect();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reloads a single source when the screen gains focus', async () => {
    const reload = jest.fn(async () => undefined);

    await render(<Probe reloads={[reload]} />);

    await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
  });

  it('reloads every source when multiple reload functions are passed', async () => {
    const reloadProducts = jest.fn(async () => undefined);
    const reloadCategories = jest.fn(async () => undefined);

    await render(<Probe reloads={[reloadProducts, reloadCategories]} />);

    await waitFor(() => {
      expect(reloadProducts).toHaveBeenCalledTimes(1);
      expect(reloadCategories).toHaveBeenCalledTimes(1);
    });
  });
});
