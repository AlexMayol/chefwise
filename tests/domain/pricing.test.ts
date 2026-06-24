import { normalizePrice } from '@/lib/domain/pricing';

describe('price normalization', () => {
  it('normalizes mass prices to price per kg', () => {
    expect(normalizePrice({ price: 2.5, quantity: 500, unit: 'g' })).toEqual({
      normalizedPrice: 5,
      normalizedUnit: 'kg',
    });
  });

  it('normalizes volume prices to price per l', () => {
    expect(normalizePrice({ price: 3, quantity: 750, unit: 'ml' })).toEqual({
      normalizedPrice: 4,
      normalizedUnit: 'l',
    });
  });

  it('normalizes count prices to price per unit', () => {
    expect(normalizePrice({ price: 4.5, quantity: 3, unit: 'unit' })).toEqual({
      normalizedPrice: 1.5,
      normalizedUnit: 'unit',
    });
  });

  it('rejects non-positive prices and quantities', () => {
    expect(() => normalizePrice({ price: 0, quantity: 1, unit: 'kg' })).toThrow();
    expect(() => normalizePrice({ price: 1, quantity: 0, unit: 'kg' })).toThrow();
  });
});
