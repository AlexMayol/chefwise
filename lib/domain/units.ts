export type UnitDimension = 'mass' | 'volume' | 'count';

export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'tsp' | 'tbsp' | 'unit';

export type NormalizedUnit = 'kg' | 'l' | 'unit';

type UnitDefinition = {
  dimension: UnitDimension;
  toBaseFactor: number;
};

const UNIT_DEFINITIONS: Record<Unit, UnitDefinition> = {
  g: { dimension: 'mass', toBaseFactor: 1 },
  kg: { dimension: 'mass', toBaseFactor: 1000 },
  ml: { dimension: 'volume', toBaseFactor: 1 },
  l: { dimension: 'volume', toBaseFactor: 1000 },
  tsp: { dimension: 'volume', toBaseFactor: 5 },
  tbsp: { dimension: 'volume', toBaseFactor: 15 },
  unit: { dimension: 'count', toBaseFactor: 1 },
};

export class UnitConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnitConversionError';
  }
}

export function getUnitDimension(unit: Unit): UnitDimension {
  return UNIT_DEFINITIONS[unit].dimension;
}

export function getNormalizedUnit(unit: Unit): NormalizedUnit {
  const dimension = getUnitDimension(unit);

  if (dimension === 'mass') {
    return 'kg';
  }

  if (dimension === 'volume') {
    return 'l';
  }

  return 'unit';
}

export function isCompatibleUnit(fromUnit: Unit, toUnit: Unit): boolean {
  return getUnitDimension(fromUnit) === getUnitDimension(toUnit);
}

export function assertCompatibleUnits(fromUnit: Unit, toUnit: Unit): void {
  if (!isCompatibleUnit(fromUnit, toUnit)) {
    throw new UnitConversionError(`Cannot convert ${fromUnit} to ${toUnit}`);
  }
}

export function convertQuantity({
  quantity,
  fromUnit,
  toUnit,
}: {
  quantity: number;
  fromUnit: Unit;
  toUnit: Unit;
}): number {
  if (quantity <= 0 || !Number.isFinite(quantity)) {
    throw new UnitConversionError('Quantity must be greater than zero');
  }

  assertCompatibleUnits(fromUnit, toUnit);

  const from = UNIT_DEFINITIONS[fromUnit];
  const to = UNIT_DEFINITIONS[toUnit];
  return (quantity * from.toBaseFactor) / to.toBaseFactor;
}

export const unitsByDimension: Record<UnitDimension, Unit[]> = {
  mass: ['g', 'kg'],
  volume: ['ml', 'l', 'tsp', 'tbsp'],
  count: ['unit'],
};
