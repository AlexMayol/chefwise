export type AppTabName =
  | 'products/index'
  | 'categories/index'
  | 'markets/index'
  | 'recipes/index'
  | 'shopping/index'
  | 'pantry/index'
  | 'settings/index';

export type AppTab = {
  name: AppTabName;
  titleKey: string;
  icon: {
    ios: string;
    android: string;
    web: string;
  };
  // ponytail: hidden from the tab bar but route stays registered; flip to show again.
  hidden?: boolean;
};

export const appTabs: AppTab[] = [
  {
    name: 'products/index',
    titleKey: 'navigation.products',
    icon: { ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' },
  },
  {
    name: 'categories/index',
    titleKey: 'navigation.categories',
    icon: { ios: 'tag', android: 'category', web: 'category' },
  },
  {
    name: 'markets/index',
    titleKey: 'navigation.markets',
    icon: { ios: 'storefront', android: 'store', web: 'store' },
  },
  {
    name: 'recipes/index',
    titleKey: 'navigation.recipes',
    icon: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  },
  {
    name: 'shopping/index',
    titleKey: 'navigation.shopping',
    icon: { ios: 'list.bullet', android: 'list', web: 'list' },
    hidden: true,
  },
  {
    name: 'pantry/index',
    titleKey: 'navigation.pantry',
    icon: { ios: 'cabinet', android: 'inventory', web: 'inventory' },
    hidden: true,
  },
  {
    name: 'settings/index',
    titleKey: 'navigation.settings',
    icon: { ios: 'gearshape', android: 'settings', web: 'settings' },
  },
];
