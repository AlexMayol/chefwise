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
  const removeMany = jest.fn(async () => {});

  beforeEach(() => {
    create.mockClear();
    removeMany.mockClear();
    useCategoriesMock.mockReturnValue({
      items: [{ id: 'category-1', name: 'Postres', description: '🍰', createdAt: '', updatedAt: '' }],
      loading: false,
      reload: jest.fn(),
      create,
      update: jest.fn(),
      remove: jest.fn(),
      removeMany,
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

  it('bulk-deletes selected categories via long-press, with confirmation', async () => {
    const screen = await render(<CategoriesScreen />);

    // Long-press enters selection mode (fireEvent bubbles to the card's Pressable).
    await fireEvent(screen.getByText('Postres'), 'longPress');
    expect(screen.getByText('1 selected')).toBeTruthy();

    // First Delete (action bar) opens the confirmation sheet, not the deletion.
    await fireEvent.press(screen.getByText('Delete'));
    expect(removeMany).not.toHaveBeenCalled();
    expect(screen.getByText('Delete 1 item?')).toBeTruthy();

    // Confirm: the sheet's Delete actually runs the bulk delete.
    const deleteButtons = screen.getAllByText('Delete');
    await fireEvent.press(deleteButtons[deleteButtons.length - 1]);
    expect(removeMany).toHaveBeenCalledWith(['category-1']);
  });
});
