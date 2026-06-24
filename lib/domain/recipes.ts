import { convertQuantity, isCompatibleUnit, type Unit } from './units';

export type RecipeCostIngredient = {
  id?: string;
  productId: string;
  quantity: number;
  unit: Unit;
};

export type RecipeCostPrice = {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  unit: Unit;
  normalizedPrice: number;
  normalizedUnit: Unit;
  observedAt: string;
};

export type RecipeCostBreakdownItem = {
  productId: string;
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

function latestByProduct(prices: RecipeCostPrice[]): RecipeCostPrice[] {
  const latest = new Map<string, RecipeCostPrice>();

  for (const price of [...prices].sort((left, right) => {
    const dateComparison = right.observedAt.localeCompare(left.observedAt);
    return dateComparison === 0 ? right.id.localeCompare(left.id) : dateComparison;
  })) {
    if (!latest.has(price.productId)) {
      latest.set(price.productId, price);
    }
  }

  return [...latest.values()];
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
  const latestPrices = latestByProduct(prices);
  const breakdown: RecipeCostBreakdownItem[] = [];
  const missingProductIds: string[] = [];

  for (const ingredient of ingredients) {
    const price = latestPrices.find(
      (candidate) =>
        candidate.productId === ingredient.productId && isCompatibleUnit(ingredient.unit, candidate.normalizedUnit),
    );

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
