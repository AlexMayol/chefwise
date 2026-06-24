import { Directory, File } from 'expo-file-system';

import { collectRelativeFilePaths, replaceLocalBackupData } from '@/lib/domain/backup-storage';

jest.mock('expo-sqlite', () => ({
  defaultDatabaseDirectory: undefined,
}));

describe('local backup storage', () => {
  it('collects nested image paths relative to the document directory', () => {
    const imagesDirectory = {
      name: 'images',
      exists: true,
      list: () => [
        {
          name: 'products',
          exists: true,
          list: () => [{ name: 'flour.jpg', bytes: async () => new Uint8Array([1]) }],
        },
        {
          name: 'recipes',
          exists: true,
          list: () => [{ name: 'bread.jpg', bytes: async () => new Uint8Array([2]) }],
        },
      ],
    };

    expect(collectRelativeFilePaths(imagesDirectory)).toEqual([
      'images/products/flour.jpg',
      'images/recipes/bread.jpg',
    ]);
  });

  it('does not replace current data when staging imported images fails', async () => {
    const operations: string[] = [];
    const existingPaths = new Set(['file://document/chefwise.sqlite', 'file://document/images']);

    function toUri(part: unknown): string {
      if (typeof part === 'string') {
        return part;
      }

      return (part as { uri?: string }).uri ?? '';
    }

    function joinUri(parts: unknown[]): string {
      return parts.map(toUri).join('/').replaceAll(/\/+/g, '/').replace('file:/', 'file://');
    }

    (Directory as unknown as jest.Mock).mockImplementation((...parts: unknown[]) => {
      const uri = joinUri(parts);
      return {
        uri,
        exists: existingPaths.has(uri),
        create: jest.fn(() => operations.push(`create-dir:${uri}`)),
        delete: jest.fn(() => operations.push(`delete-dir:${uri}`)),
      };
    });

    (File as unknown as jest.Mock).mockImplementation((...parts: unknown[]) => {
      const uri = joinUri(parts);
      return {
        uri,
        exists: existingPaths.has(uri),
        create: jest.fn(() => operations.push(`create-file:${uri}`)),
        write: jest.fn(() => {
          operations.push(`write-file:${uri}`);
          if (uri.endsWith('/images/products/flour.jpg')) {
            throw new Error('disk full');
          }
        }),
        delete: jest.fn(() => operations.push(`delete-file:${uri}`)),
        copy: jest.fn(async (destination: { uri: string }) => operations.push(`copy-file:${uri}->${destination.uri}`)),
      };
    });

    await expect(
      replaceLocalBackupData({
        databaseBytes: new Uint8Array([1]),
        imageFiles: [{ path: 'images/products/flour.jpg', bytes: new Uint8Array([2]) }],
      }),
    ).rejects.toThrow('disk full');

    expect(operations.some((operation) => operation.startsWith('delete-file:') && operation.includes('chefwise.sqlite'))).toBe(false);
    expect(operations.some((operation) => operation.startsWith('delete-dir:') && operation.includes('/images'))).toBe(false);
    expect(operations.some((operation) => operation.includes('->file://document/chefwise.sqlite'))).toBe(false);
    expect(operations.some((operation) => operation.startsWith('create-dir:file://document/images'))).toBe(false);
    expect(operations.some((operation) => operation.startsWith('create-file:file://document/images'))).toBe(false);
  });
});
