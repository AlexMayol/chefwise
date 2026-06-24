import { shouldRenderListEmptyState } from '@/lib/ui/feature-screen';

describe('FeatureScreen empty state behavior', () => {
  it('does not render a list empty state for form-only screens', () => {
    expect(shouldRenderListEmptyState(undefined)).toBe(false);
  });

  it('renders an empty state when a list screen provides no rows', () => {
    expect(shouldRenderListEmptyState([])).toBe(true);
  });

  it('does not render an empty state when rows exist', () => {
    expect(shouldRenderListEmptyState([{ id: 'product-1' }])).toBe(false);
  });
});
