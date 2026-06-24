import { act, fireEvent, render } from '@testing-library/react-native';

import CategoriesScreen from '@/app/(tabs)/categories';
import { useCategories } from '@/lib/hooks/use-categories';

let mockFocusCleanup: (() => void) | undefined;

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useFocusEffect: (effect: () => void | (() => void)) => {
    mockFocusCleanup = effect() ?? undefined;
  },
}));

jest.mock('@/lib/hooks/use-categories', () => ({
  useCategories: jest.fn(),
}));

const useCategoriesMock = useCategories as jest.MockedFunction<typeof useCategories>;

describe('categories screen', () => {
  const update = jest.fn(async () => undefined);

  beforeEach(() => {
    mockFocusCleanup = undefined;
    update.mockClear();
    useCategoriesMock.mockReturnValue({
      items: [{ id: 'category-1', name: 'Postres', createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      update,
      remove: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('opens a prefilled edit form when tapping a category', async () => {
    const screen = await render(<CategoriesScreen />);

    await fireEvent.press(screen.getByText('Postres'));
    expect(screen.getByDisplayValue('Postres')).toBeTruthy();

    await fireEvent.changeText(screen.getByDisplayValue('Postres'), 'Desserts');
    await fireEvent.press(screen.getByText('Save'));

    expect(update).toHaveBeenCalledWith('category-1', { name: 'Desserts' });
  });

  it('closes the edit form when the category tab loses focus', async () => {
    const screen = await render(<CategoriesScreen />);

    await fireEvent.press(screen.getByText('Postres'));
    expect(screen.getByDisplayValue('Postres')).toBeTruthy();
    expect(mockFocusCleanup).toEqual(expect.any(Function));

    await act(async () => {
      mockFocusCleanup?.();
    });

    expect(screen.queryByDisplayValue('Postres')).toBeNull();
    expect(screen.getByText('Postres')).toBeTruthy();
  });
});
