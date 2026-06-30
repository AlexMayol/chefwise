import { fireEvent, render } from '@testing-library/react-native';
import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { FloatingTabBar } from '@/components/domain/floating-tab-bar';
import { appTabs } from '@/lib/navigation/tabs';

jest.mock('@/components/useColorScheme', () => ({ useColorScheme: () => 'light' }));
jest.mock('@/lib/i18n', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));

function makeProps(activeName: string) {
  const routes = appTabs.map((tab) => ({ key: `${tab.name}-key`, name: tab.name }));
  const navigation = {
    navigate: jest.fn(),
    emit: jest.fn(() => ({ defaultPrevented: false })),
  };
  const state = { index: routes.findIndex((r) => r.name === activeName), routes };
  const props = { state, navigation, descriptors: {}, insets: { top: 0, bottom: 0, left: 0, right: 0 } } as unknown as BottomTabBarProps;
  return { props, navigation };
}

describe('FloatingTabBar', () => {
  it('renders only the visible tabs', async () => {
    const { props } = makeProps('recipes/index');
    const screen = await render(<FloatingTabBar {...props} />);

    expect(screen.queryByText('navigation.products')).toBeTruthy();
    expect(screen.queryByText('navigation.recipes')).toBeTruthy();
    expect(screen.queryByText('navigation.settings')).toBeTruthy();
    // shopping & pantry are hidden tabs and must not appear
    expect(screen.queryByText('navigation.shopping')).toBeNull();
    expect(screen.queryByText('navigation.pantry')).toBeNull();
  });

  it('navigates to a non-focused tab on press', async () => {
    const { props, navigation } = makeProps('recipes/index');
    const screen = await render(<FloatingTabBar {...props} />);

    fireEvent.press(screen.getByText('navigation.products'));

    expect(navigation.emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'tabPress', target: 'products/index-key' }),
    );
    expect(navigation.navigate).toHaveBeenCalledWith('products/index');
  });

  it('does not navigate when pressing the focused tab', async () => {
    const { props, navigation } = makeProps('recipes/index');
    const screen = await render(<FloatingTabBar {...props} />);

    fireEvent.press(screen.getByText('navigation.recipes'));

    expect(navigation.navigate).not.toHaveBeenCalled();
  });
});
