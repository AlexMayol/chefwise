import { getListingCreateVisibility, shouldShowFilteredEmptyNew, shouldShowListFooterNew } from '@/lib/ui/listing-create-actions';

describe('isListingSearchActive', () => {
  it('is false for blank or whitespace-only queries', () => {
    expect(getListingCreateVisibility('', 0).isSearchActive).toBe(false);
    expect(getListingCreateVisibility('   ', 3).isSearchActive).toBe(false);
  });

  it('is true when the query has non-whitespace characters', () => {
    expect(getListingCreateVisibility('flour', 3).isSearchActive).toBe(true);
  });
});

describe('getListingCreateVisibility', () => {
  it('combines search state with footer and filtered-empty rules', () => {
    expect(getListingCreateVisibility('', 6)).toEqual({
      isSearchActive: false,
      showListFooterNew: true,
      showFilteredEmptyNew: false,
    });
    expect(getListingCreateVisibility('missing', 0)).toEqual({
      isSearchActive: true,
      showListFooterNew: false,
      showFilteredEmptyNew: true,
    });
  });
});

describe('shouldShowListFooterNew', () => {
  it('shows when search is empty and there are more than five items', () => {
    expect(shouldShowListFooterNew(6, false)).toBe(true);
  });

  it('hides at five items or fewer', () => {
    expect(shouldShowListFooterNew(5, false)).toBe(false);
    expect(shouldShowListFooterNew(0, false)).toBe(false);
  });

  it('hides while search is active regardless of count', () => {
    expect(shouldShowListFooterNew(10, true)).toBe(false);
  });
});

describe('shouldShowFilteredEmptyNew', () => {
  it('shows when search is active and there are no results', () => {
    expect(shouldShowFilteredEmptyNew(0, true)).toBe(true);
  });

  it('hides when search is inactive', () => {
    expect(shouldShowFilteredEmptyNew(0, false)).toBe(false);
  });

  it('hides when search is active but results exist', () => {
    expect(shouldShowFilteredEmptyNew(3, true)).toBe(false);
  });
});
