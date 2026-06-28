import { fireEvent, render } from '@testing-library/react-native';

import NewCategoryScreen from '@/app/categories/new';
import { useCategories } from '@/lib/hooks/use-categories';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('@/lib/hooks/use-categories', () => ({
  useCategories: jest.fn(),
}));

const useCategoriesMock = useCategories as jest.MockedFunction<typeof useCategories>;

describe('new category screen', () => {
  const create = jest.fn(async () => ({ id: 'new', name: '', description: null, createdAt: '', updatedAt: '' }));

  beforeEach(() => {
    create.mockClear();
    useCategoriesMock.mockReturnValue({
      items: [],
      loading: false,
      reload: jest.fn(),
      create,
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a category and navigates back', async () => {
    const screen = await render(<NewCategoryScreen />);

    await fireEvent.changeText(screen.getByLabelText('Name'), 'Drinks');
    await fireEvent.press(screen.getByLabelText('Save'));

    expect(create).toHaveBeenCalledWith({ name: 'Drinks', description: null });
  });
});
