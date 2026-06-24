import { buildEntityImagePath, isRelativeImagePath, resolveImageUri } from '@/lib/images/paths';
import { saveEntityImage } from '@/lib/images/storage';
import { Directory, File } from 'expo-file-system';

describe('local image paths', () => {
  it('builds product, recipe, and market relative image paths', () => {
    expect(buildEntityImagePath('product', 'abc')).toBe('images/products/abc.jpg');
    expect(buildEntityImagePath('recipe', 'def')).toBe('images/recipes/def.jpg');
    expect(buildEntityImagePath('market', 'ghi')).toBe('images/markets/ghi.jpg');
  });

  it('rejects absolute filesystem paths before persistence', () => {
    expect(isRelativeImagePath('/var/mobile/image.jpg')).toBe(false);
    expect(isRelativeImagePath('file:///var/mobile/image.jpg')).toBe(false);
    expect(isRelativeImagePath('images/products/abc.jpg')).toBe(true);
    expect(isRelativeImagePath('images/markets/ghi.jpg')).toBe(true);
  });

  it('resolves relative paths against a document directory', () => {
    expect(resolveImageUri('images/products/abc.jpg', 'file:///document/')).toBe('file:///document/images/products/abc.jpg');
  });

  it('copies picked images from the source uri into the app image directory', async () => {
    const operations: string[] = [];

    (Directory as unknown as jest.Mock).mockImplementation((base: { uri?: string } | string, ...parts: string[]) => {
      const uri = `${typeof base === 'string' ? base : (base.uri ?? '')}${parts.join('/')}`;
      return {
        uri,
        exists: false,
        create: jest.fn(() => operations.push(`create-dir:${uri}`)),
      };
    });

    (File as unknown as jest.Mock).mockImplementation((base: { uri?: string } | string, path = '') => {
      const uri = `${typeof base === 'string' ? base : (base.uri ?? '')}${path}`;
      return {
        uri,
        copy: jest.fn((destination: { uri: string }) => operations.push(`copy:${uri}->${destination.uri}`)),
      };
    });

    await expect(saveEntityImage('product', 'flour', 'file:///cache/picked.jpg')).resolves.toBe('images/products/flour.jpg');

    expect(operations).toContain('create-dir:file:///document/images/products');
    expect(operations).toContain('copy:file:///cache/picked.jpg->file:///document/images/products/flour.jpg');
  });
});
