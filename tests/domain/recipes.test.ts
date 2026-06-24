import { calculateRecipeCost } from '@/lib/domain/recipes';

const observedAt = '2026-06-24T00:00:00.000Z';

describe('recipe cost engine', () => {
  it('calculates manual market cost and cost per serving', () => {
    const result = calculateRecipeCost({
      servings: 2,
      pricingStrategy: 'manual',
      ingredients: [{ id: 'ri-1', productId: 'flour', quantity: 500, unit: 'g', marketId: 'market-1' }],
      prices: [
        {
          id: 'p-1',
          productId: 'flour',
          marketId: 'market-1',
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

  it('chooses the cheapest compatible latest price across markets', () => {
    const result = calculateRecipeCost({
      servings: 1,
      pricingStrategy: 'cheapest_available',
      ingredients: [{ id: 'ri-1', productId: 'milk', quantity: 500, unit: 'ml' }],
      prices: [
        { id: 'expensive', productId: 'milk', marketId: 'a', price: 3, quantity: 1, unit: 'l', normalizedPrice: 3, normalizedUnit: 'l', observedAt },
        { id: 'cheap', productId: 'milk', marketId: 'b', price: 2, quantity: 1, unit: 'l', normalizedPrice: 2, normalizedUnit: 'l', observedAt },
      ],
    });

    expect(result.complete).toBe(true);
    expect(result.totalCost).toBe(1);
    expect(result.breakdown[0]?.marketId).toBe('b');
  });

  it('marks cost incomplete when an ingredient has no usable price', () => {
    const result = calculateRecipeCost({
      servings: 4,
      pricingStrategy: 'manual',
      ingredients: [{ id: 'ri-1', productId: 'eggs', quantity: 2, unit: 'unit', marketId: 'market-1' }],
      prices: [],
    });

    expect(result.complete).toBe(false);
    expect(result.missingProductIds).toEqual(['eggs']);
  });

  it('does not expose partial totals when any ingredient is missing a compatible price', () => {
    const result = calculateRecipeCost({
      servings: 4,
      pricingStrategy: 'manual',
      ingredients: [
        { id: 'ri-1', productId: 'flour', quantity: 500, unit: 'g', marketId: 'market-1' },
        { id: 'ri-2', productId: 'eggs', quantity: 2, unit: 'unit', marketId: 'market-1' },
      ],
      prices: [
        {
          id: 'p-1',
          productId: 'flour',
          marketId: 'market-1',
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
