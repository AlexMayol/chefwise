import { calculateRecipeCost } from '@/lib/domain/recipes';

const observedAt = '2026-06-24T00:00:00.000Z';

describe('recipe cost engine', () => {
  it('calculates ingredient cost and cost per serving from the latest product price', () => {
    const result = calculateRecipeCost({
      servings: 2,
      ingredients: [{ id: 'ri-1', productId: 'flour', quantity: 500, unit: 'g' }],
      prices: [
        {
          id: 'p-1',
          productId: 'flour',
          price: 2,
          quantity: 1,
          unit: 'kg',
          normalizedPrice: 2,
          normalizedUnit: 'kg',
          observedAt,
        },
      ],
    });

    expect(result.complete).toBe(true);
    expect(result.totalCost).toBe(1);
    expect(result.costPerServing).toBe(0.5);
  });

  it('uses the most recently observed price per product', () => {
    const result = calculateRecipeCost({
      servings: 1,
      ingredients: [{ id: 'ri-1', productId: 'milk', quantity: 500, unit: 'ml' }],
      prices: [
        { id: 'old', productId: 'milk', price: 3, quantity: 1, unit: 'l', normalizedPrice: 3, normalizedUnit: 'l', observedAt: '2026-01-01T00:00:00.000Z' },
        { id: 'new', productId: 'milk', price: 2, quantity: 1, unit: 'l', normalizedPrice: 2, normalizedUnit: 'l', observedAt },
      ],
    });

    expect(result.complete).toBe(true);
    expect(result.totalCost).toBe(1);
    expect(result.breakdown[0]?.priceId).toBe('new');
  });

  it('marks cost incomplete when an ingredient has no usable price', () => {
    const result = calculateRecipeCost({
      servings: 4,
      ingredients: [{ id: 'ri-1', productId: 'eggs', quantity: 2, unit: 'unit' }],
      prices: [],
    });

    expect(result.complete).toBe(false);
    expect(result.missingProductIds).toEqual(['eggs']);
  });

  it('does not expose partial totals when any ingredient is missing a compatible price', () => {
    const result = calculateRecipeCost({
      servings: 4,
      ingredients: [
        { id: 'ri-1', productId: 'flour', quantity: 500, unit: 'g' },
        { id: 'ri-2', productId: 'eggs', quantity: 2, unit: 'unit' },
      ],
      prices: [
        {
          id: 'p-1',
          productId: 'flour',
          price: 2,
          quantity: 1,
          unit: 'kg',
          normalizedPrice: 2,
          normalizedUnit: 'kg',
          observedAt,
        },
      ],
    });

    expect(result.complete).toBe(false);
    expect(result.totalCost).toBeNull();
    expect(result.costPerServing).toBeNull();
    expect(result.missingProductIds).toEqual(['eggs']);
  });
});
