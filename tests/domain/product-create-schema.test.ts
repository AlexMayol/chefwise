import { productCreateSchema } from '@/lib/validation/products';

describe('productCreateSchema', () => {
  const base = { name: 'Tomato', defaultUnit: 'kg' as const };

  it('accepts a product with no price', () => {
    expect(productCreateSchema.safeParse(base).success).toBe(true);
  });

  it('accepts a price when a market is set and coerces it to a number', () => {
    const result = productCreateSchema.safeParse({ ...base, marketId: 'm1', price: '2.5' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(2.5);
    }
  });

  it('accepts a comma decimal separator (Spanish input)', () => {
    expect(productCreateSchema.safeParse({ ...base, marketId: 'm1', price: '3,99' }).success).toBe(true);
    const result = productCreateSchema.safeParse({ ...base, marketId: 'm1', price: '1.234,56' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(1234.56);
    }
  });

  it('rejects a price without a market', () => {
    const result = productCreateSchema.safeParse({ ...base, price: '2.5' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === 'marketId' && issue.message === 'validation.marketRequired'),
      ).toBe(true);
    }
  });
});
