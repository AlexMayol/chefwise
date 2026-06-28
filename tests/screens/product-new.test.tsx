import { fireEvent, render, waitFor } from '@testing-library/react-native';

import NewProductScreen from '@/app/products/new';
import { useProductOffers } from '@/lib/hooks/use-product-offers';
import { useProducts } from '@/lib/hooks/use-products';

const mockParams = jest.fn(() => ({}) as Record<string, string>);
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
  useLocalSearchParams: () => mockParams(),
}));

jest.mock('@/lib/hooks/use-products', () => ({ useProducts: jest.fn() }));
jest.mock('@/lib/hooks/use-product-offers', () => ({ useProductOffers: jest.fn() }));
jest.mock('@/lib/hooks/use-categories', () => ({
  useCategories: jest.fn(() => ({
    items: [],
    loading: false,
    reload: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeMany: jest.fn(),
  })),
}));

// Leaf pickers that are irrelevant to the create orchestration — keep the test focused.
jest.mock('@/components/domain/entity-image-field', () => ({ EntityImageField: () => null }));
jest.mock('@/components/domain/category-select', () => ({ CategorySelect: () => null }));
jest.mock('@/components/domain/market-select', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    MarketSelect: ({ onChange }: { onChange: (value: string) => void }) =>
      React.createElement(
        Pressable,
        { accessibilityLabel: 'pick-market', onPress: () => onChange('market-1') },
        React.createElement(Text, null, 'pick-market'),
      ),
  };
});

const useProductsMock = useProducts as jest.MockedFunction<typeof useProducts>;
const useProductOffersMock = useProductOffers as jest.MockedFunction<typeof useProductOffers>;

describe('new product screen', () => {
  const create = jest.fn(async (input: { name: string }) => ({
    id: 'product-1',
    ...input,
    createdAt: '',
    updatedAt: '',
  }));
  const createWithPrice = jest.fn(async () => ({}));

  beforeEach(() => {
    create.mockClear();
    createWithPrice.mockClear();
    mockParams.mockReturnValue({});
    useProductsMock.mockReturnValue({
      items: [],
      loading: false,
      reload: jest.fn(),
      create: create as never,
      update: jest.fn(),
      remove: jest.fn(),
      removeMany: jest.fn(),
      assign: jest.fn(),
    });
    useProductOffersMock.mockReturnValue({
      items: [],
      loading: false,
      reload: jest.fn(),
      create: jest.fn(),
      createWithPrice: createWithPrice as never,
      update: jest.fn(),
      remove: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a product with an initial offer + price', async () => {
    const screen = await render(<NewProductScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('e.g. Tomato'), 'Tomato');
    await fireEvent.press(screen.getByLabelText('pick-market'));
    await fireEvent.changeText(screen.getByPlaceholderText('0.00'), '2.5');
    await fireEvent.press(screen.getByLabelText('Save'));

    await waitFor(() => expect(create).toHaveBeenCalled());
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Tomato', defaultUnit: 'unit' }));
    expect(createWithPrice).toHaveBeenCalledWith(
      expect.objectContaining({ productId: 'product-1', marketId: 'market-1', brand: null, quantity: 1, unit: 'unit' }),
      2.5,
    );
  });

  it('preselects the market passed via route params', async () => {
    mockParams.mockReturnValue({ marketId: 'market-9' });
    const screen = await render(<NewProductScreen />);

    // No pick-market press: the market should already be set from the route param.
    await fireEvent.changeText(screen.getByPlaceholderText('e.g. Tomato'), 'Tomato');
    await fireEvent.changeText(screen.getByPlaceholderText('0.00'), '2.5');
    await fireEvent.press(screen.getByLabelText('Save'));

    await waitFor(() => expect(createWithPrice).toHaveBeenCalled());
    expect(createWithPrice).toHaveBeenCalledWith(expect.objectContaining({ marketId: 'market-9' }), 2.5);
  });

  it('creates a product without a price', async () => {
    const screen = await render(<NewProductScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('e.g. Tomato'), 'Salt');
    await fireEvent.press(screen.getByLabelText('Save'));

    await waitFor(() => expect(create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Salt' })));
    expect(createWithPrice).not.toHaveBeenCalled();
  });

  it('also submits from the bottom Save button', async () => {
    const screen = await render(<NewProductScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('e.g. Tomato'), 'Pepper');
    // The header Save is an icon (accessibilityLabel "Save"); the in-body button has the text.
    await fireEvent.press(screen.getByText('Save'));

    await waitFor(() => expect(create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Pepper' })));
  });
});
