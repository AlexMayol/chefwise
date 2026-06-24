import { fireEvent, render } from '@testing-library/react-native';

import CategoriesScreen from '@/app/(tabs)/categories';
import { useCategories } from '@/lib/hooks/use-categories';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useFocusEffect: (effect: () => void | (() => void)) => {
    effect();
  },
}));

jest.mock('@/lib/hooks/use-categories', () => ({
  useCategories: jest.fn(),
}));

const useCategoriesMock = useCategories as jest.MockedFunction<typeof useCategories>;

describe('categories screen', () => {
  const create = jest.fn(async () => ({ id: 'new', name: '', description: null, createdAt: '', updatedAt: '' }));

  beforeEach(() => {
    create.mockClear();
    useCategoriesMock.mockReturnValue({
      items: [{ id: 'category-1', name: 'Postres', description: '🍰', createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create,
      update: jest.fn(),
      remove: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lists categories', async () => {
    const screen = await render(<CategoriesScreen />);

    expect(screen.getByText('Postres')).toBeTruthy();
  });

  it('creates a category from the add form', async () => {
    const screen = await render(<CategoriesScreen />);

    await fireEvent.press(screen.getByText('New category'));
    await fireEvent.changeText(screen.getByPlaceholderText('Uncategorized'), 'Drinks');
    await fireEvent.press(screen.getByText('Save'));

    expect(create).toHaveBeenCalledWith({ name: 'Drinks', description: null });
  });
});
