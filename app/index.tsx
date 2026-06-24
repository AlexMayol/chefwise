import { Redirect } from 'expo-router';

// ponytail: `/` has no route inside (tabs) (first tab is products/index at /products),
// so launch fell through to +not-found. Redirect the entry URL to the first tab.
export default function Index() {
  return <Redirect href="/products" />;
}
