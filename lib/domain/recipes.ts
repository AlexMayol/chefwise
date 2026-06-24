import { convertQuantity, isCompatibleUnit, type Unit } from './units';

export type RecipePricingStrategy = 'manual' | 'cheapest_available';

export type RecipeCostIngredient = {
  id?: string;
  productId: string;
  quantity: number;
  unit: Unit;
  marketId?: string | null;
};

export type RecipeCostPrice = {
  id: string;
  productId: string;
  marketId: string;
  price: number;
  quantity: number;
  unit: Unit;
  normalizedPrice: number;
  normalizedUnit: Unit;
  observedAt: string;
};

export type RecipeCostBreakdownItem = {
  productId: string;
  marketId: string;
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

function latestByMarket(prices: RecipeCostPrice[]): RecipeCostPrice[] {
  const latest = new Map<string, RecipeCostPrice>();

  for (const price of [...prices].sort((left, right) => {
    const dateComparison = right.observedAt.localeCompare(left.observedAt);
    return dateComparison === 0 ? right.id.localeCompare(left.id) : dateComparison;
  })) {
    const key = `${price.productId}:${price.marketId}`;
    if (!latest.has(key)) {
      latest.set(key, price);
    }
  }

  return [...latest.values()];
}

export function calculateRecipeCost({
  servings,
  pricingStrategy,
  ingredients,
  prices,
}: {
  servings: number;
  pricingStrategy: RecipePricingStrategy;
  ingredients: RecipeCostIngredient[];
  prices: RecipeCostPrice[];
}): RecipeCostResult {
  const latestPrices = latestByMarket(prices);
  const breakdown: RecipeCostBreakdownItem[] = [];
  const missingProductIds: string[] = [];

  for (const ingredient of ingredients) {
    const candidates = latestPrices.filter((price) => {
      if (price.productId !== ingredient.productId) {
        return false;
      }

      if (pricingStrategy === 'manual' && price.marketId !== ingredient.marketId) {
        return false;
      }

      return isCompatibleUnit(ingredient.unit, price.normalizedUnit);
    });

    const price =
      pricingStrategy === 'cheapest_available'
        ? candidates.sort((left, right) => left.normalizedPrice - right.normalizedPrice)[0]
        : candidates[0];

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
      marketId: price.marketId,
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
