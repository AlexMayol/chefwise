import { calculateRecipeCost, calculateRecipeCosts } from '@/lib/domain/recipes';

const observedAt = '2026-06-24T00:00:00.000Z';

describe('batch recipe cost', () => {
  it('keys each recipe cost by id, sharing one price pool', () => {
    const prices = [
      { id: 'p-1', offerId: 'o-1', productId: 'flour', normalizedPrice: 2, normalizedUnit: 'kg' as const, observedAt },
    ];
    const costs = calculateRecipeCosts(
      [
        { id: 'r-1', servings: 2, ingredients: [{ productId: 'flour', quantity: 500, unit: 'g' }] },
        { id: 'r-2', servings: 1, ingredients: [{ productId: 'sugar', quantity: 100, unit: 'g' }] },
      ],
      prices,
    );

    expect(costs['r-1'].totalCost).toBe(1);
    expect(costs['r-1'].complete).toBe(true);
    expect(costs['r-2'].complete).toBe(false); // sugar has no price
    expect(costs['r-2'].totalCost).toBeNull();
  });
});

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
