import { appTabs } from '@/lib/navigation/tabs';

describe('app tabs', () => {
  it('exposes product and category management as separate bottom tabs', () => {
    expect(appTabs.map((tab) => tab.name)).toEqual([
      'products/index',
      'categories/index',
      'markets/index',
      'recipes/index',
      'shopping/index',
      'pantry/index',
      'settings/index',
    ]);
  });
});
