import { calculateRecipeCost } from '@/lib/domain/recipes';

const observedAt = '2026-06-24T00:00:00.000Z';

describe('recipe cost engine', () => {
  it('calculates ingredient cost and cost per serving from an offer price', () => {
    const result = calculateRecipeCost({
      servings: 2,
      ingredients: [{ id: 'ri-1', productId: 'flour', quantity: 500, unit: 'g' }],
      prices: [{ id: 'p-1', offerId: 'o-1', productId: 'flour', normalizedPrice: 2, normalizedUnit: 'kg', observedAt }],
    });

    expect(result.complete).toBe(true);
    expect(result.totalCost).toBe(1);
    expect(result.costPerServing).toBe(0.5);
    expect(result.breakdown[0]?.offerId).toBe('o-1');
  });

  it('uses the cheapest current offer when no offer is chosen', () => {
    const result = calculateRecipeCost({
      servings: 1,
      ingredients: [{ id: 'ri-1', productId: 'milk', quantity: 500, unit: 'ml' }],
      prices: [
        { id: 'pricey', offerId: 'o-pricey', productId: 'milk', normalizedPrice: 3, normalizedUnit: 'l', observedAt },
        { id: 'cheap', offerId: 'o-cheap', productId: 'milk', normalizedPrice: 2, normalizedUnit: 'l', observedAt },
      ],
    });

    expect(result.complete).toBe(true);
    expect(result.totalCost).toBe(1);
    expect(result.breakdown[0]?.offerId).toBe('o-cheap');
  });

  it('uses the chosen offer over the cheapest one', () => {
    const result = calculateRecipeCost({
      servings: 1,
      ingredients: [{ id: 'ri-1', productId: 'milk', offerId: 'o-pricey', quantity: 500, unit: 'ml' }],
      prices: [
        { id: 'pricey', offerId: 'o-pricey', productId: 'milk', normalizedPrice: 3, normalizedUnit: 'l', observedAt },
        { id: 'cheap', offerId: 'o-cheap', productId: 'milk', normalizedPrice: 2, normalizedUnit: 'l', observedAt },
      ],
    });

    expect(result.totalCost).toBe(1.5);
    expect(result.breakdown[0]?.offerId).toBe('o-pricey');
  });

  it('marks cost incomplete when an ingredient has no usable offer price', () => {
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
      prices: [{ id: 'p-1', offerId: 'o-1', productId: 'flour', normalizedPrice: 2, normalizedUnit: 'kg', observedAt }],
    });

    expect(result.complete).toBe(false);
    expect(result.totalCost).toBeNull();
    expect(result.costPerServing).toBeNull();
    expect(result.missingProductIds).toEqual(['eggs']);
  });
});
