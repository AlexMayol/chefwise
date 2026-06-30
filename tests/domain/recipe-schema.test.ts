import { recipeSchema } from '@/lib/validation/recipes';

describe('recipe schema servings', () => {
  it('accepts a blank servings field and yields undefined', () => {
    const result = recipeSchema.safeParse({ name: 'Soup', servings: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.servings).toBeUndefined();
  });

  it('accepts an omitted servings field', () => {
    const result = recipeSchema.safeParse({ name: 'Soup' });
    expect(result.success).toBe(true);
  });

  it('still rejects a non-positive servings value', () => {
    expect(recipeSchema.safeParse({ name: 'Soup', servings: '0' }).success).toBe(false);
  });

  it('coerces a provided servings value', () => {
    const result = recipeSchema.safeParse({ name: 'Soup', servings: '4' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.servings).toBe(4);
  });
});
