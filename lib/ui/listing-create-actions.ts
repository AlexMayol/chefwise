export function shouldShowListFooterNew(itemCount: number, isSearchActive: boolean): boolean {
  return !isSearchActive && itemCount > 5;
}

export function shouldShowFilteredEmptyNew(itemCount: number, isSearchActive: boolean): boolean {
  return isSearchActive && itemCount === 0;
}

export function isListingSearchActive(query: string): boolean {
  return query.trim().length > 0;
}

export function getListingCreateVisibility(query: string, itemCount: number) {
  const isSearchActive = isListingSearchActive(query);
  return {
    isSearchActive,
    showListFooterNew: shouldShowListFooterNew(itemCount, isSearchActive),
    showFilteredEmptyNew: shouldShowFilteredEmptyNew(itemCount, isSearchActive),
  };
}
