import { convertQuantity, getNormalizedUnit, isCompatibleUnit, UnitConversionError } from '@/lib/domain/units';

describe('unit conversion', () => {
  it('converts mass units within the mass dimension', () => {
    expect(convertQuantity({ quantity: 1250, fromUnit: 'g', toUnit: 'kg' })).toBe(1.25);
    expect(convertQuantity({ quantity: 1.5, fromUnit: 'kg', toUnit: 'g' })).toBe(1500);
  });

  it('converts volume units using the PRD defaults', () => {
    expect(convertQuantity({ quantity: 2, fromUnit: 'tbsp', toUnit: 'ml' })).toBe(30);
    expect(convertQuantity({ quantity: 3, fromUnit: 'tsp', toUnit: 'ml' })).toBe(15);
    expect(convertQuantity({ quantity: 750, fromUnit: 'ml', toUnit: 'l' })).toBe(0.75);
  });

  it('keeps count quantities in unit', () => {
    expect(convertQuantity({ quantity: 6, fromUnit: 'unit', toUnit: 'unit' })).toBe(6);
    expect(getNormalizedUnit('unit')).toBe('unit');
  });

  it('rejects cross-dimension conversions with a typed error', () => {
    expect(() => convertQuantity({ quantity: 1, fromUnit: 'kg', toUnit: 'l' })).toThrow(UnitConversionError);
    expect(isCompatibleUnit('kg', 'l')).toBe(false);
  });

  it('rejects zero or negative quantities', () => {
    expect(() => convertQuantity({ quantity: 0, fromUnit: 'kg', toUnit: 'g' })).toThrow(UnitConversionError);
    expect(() => convertQuantity({ quantity: -1, fromUnit: 'kg', toUnit: 'g' })).toThrow(UnitConversionError);
  });
});
