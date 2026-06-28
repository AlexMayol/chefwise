import { convertQuantity, isCompatibleUnit, type Unit } from './units';

export type RecipeCostIngredient = {
  id?: string;
  productId: string;
  // Chosen offer to cost against; null/undefined = use the cheapest current offer.
  offerId?: string | null;
  quantity: number;
  unit: Unit;
};

// One candidate = the latest price of a single offer (built upstream from product_offers).
export type RecipeCostPrice = {
  id: string;
  offerId: string;
  productId: string;
  normalizedPrice: number;
  normalizedUnit: Unit;
  observedAt: string;
};

export type RecipeCostBreakdownItem = {
  productId: string;
  offerId: string;
  cost: number;
  priceId: string;
};

export type RecipeCostResult = {
  complete: boolean;
  totalCost: number | null;
  costPerServing: number | null;
  breakdown: RecipeCostBreakdownItem[];
  missingProductIds: string[];
};

// Pick the price to cost an ingredient with: the chosen offer when it has a usable price,
// otherwise the cheapest unit-compatible offer for that product.
function pickPrice(ingredient: RecipeCostIngredient, candidates: RecipeCostPrice[]): RecipeCostPrice | undefined {
  const compatible = candidates.filter(
    (candidate) =>
      candidate.productId === ingredient.productId && isCompatibleUnit(ingredient.unit, candidate.normalizedUnit),
  );

  if (ingredient.offerId) {
    const chosen = compatible.find((candidate) => candidate.offerId === ingredient.offerId);
    if (chosen) {
      return chosen;
    }
  }

  return compatible.reduce<RecipeCostPrice | undefined>(
    (best, candidate) => (!best || candidate.normalizedPrice < best.normalizedPrice ? candidate : best),
    undefined,
  );
}

export function calculateRecipeCost({
  servings,
  ingredients,
  prices,
}: {
  servings: number;
  ingredients: RecipeCostIngredient[];
  prices: RecipeCostPrice[];
}): RecipeCostResult {
  const breakdown: RecipeCostBreakdownItem[] = [];
  const missingProductIds: string[] = [];

  for (const ingredient of ingredients) {
    const price = pickPrice(ingredient, prices);

    if (!price) {
      missingProductIds.push(ingredient.productId);
      continue;
    }

    const quantityInPriceUnit = convertQuantity({
      quantity: ingredient.quantity,
      fromUnit: ingredient.unit,
      toUnit: price.normalizedUnit,
    });

    breakdown.push({
      productId: ingredient.productId,
      offerId: price.offerId,
      priceId: price.id,
      cost: quantityInPriceUnit * price.normalizedPrice,
    });
  }

  const complete = missingProductIds.length === 0;
  const totalCost = complete ? breakdown.reduce((sum, item) => sum + item.cost, 0) : null;

  return {
    complete,
    totalCost,
    costPerServing: totalCost !== null && servings > 0 ? totalCost / servings : null,
    breakdown,
    missingProductIds,
  };
}
