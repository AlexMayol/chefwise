import { createId } from '@/lib/db/repositories/base';

describe('repository base helpers', () => {
  it('creates prefixed UUID ids', () => {
    expect(createId('market')).toMatch(
      /^market-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
