import { chunkGridRows } from '@/lib/ui/grid';

describe('grid layout helpers', () => {
  it('chunks items into rows of three', () => {
    expect(chunkGridRows([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('keeps empty collections empty', () => {
    expect(chunkGridRows([], 3)).toEqual([]);
  });
});
