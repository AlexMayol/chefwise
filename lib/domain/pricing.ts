import { convertQuantity, getNormalizedUnit, type NormalizedUnit, type Unit } from './units';

export type NormalizedPrice = {
  normalizedPrice: number;
  normalizedUnit: NormalizedUnit;
};

export function normalizePrice({
  price,
  quantity,
  unit,
}: {
  price: number;
  quantity: number;
  unit: Unit;
}): NormalizedPrice {
  if (price <= 0 || !Number.isFinite(price)) {
    throw new Error('Price must be greater than zero');
  }

  const normalizedUnit = getNormalizedUnit(unit);
  const normalizedQuantity = convertQuantity({ quantity, fromUnit: unit, toUnit: normalizedUnit });

  return {
    normalizedPrice: price / normalizedQuantity,
    normalizedUnit,
  };
}

export type PriceCandidate = {
  id: string;
  productId: string;
  marketId: string;
  price: number;
  quantity: number;
  unit: Unit;
  normalizedPrice: number;
  normalizedUnit: NormalizedUnit;
  observedAt: string;
};

export function sortLatestPrices<T extends { observedAt: string; id: string }>(prices: T[]): T[] {
  return [...prices].sort((left, right) => {
    const dateComparison = right.observedAt.localeCompare(left.observedAt);
    return dateComparison === 0 ? right.id.localeCompare(left.id) : dateComparison;
  });
}
