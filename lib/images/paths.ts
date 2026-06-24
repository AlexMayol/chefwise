export type ImageEntityType = 'product' | 'recipe';
export type RelativeImagePath = `images/${'products' | 'recipes'}/${string}.jpg`;

export function buildEntityImagePath(entityType: ImageEntityType, entityId: string): RelativeImagePath {
  const directory = entityType === 'product' ? 'products' : 'recipes';
  return `images/${directory}/${entityId}.jpg`;
}

export function isRelativeImagePath(path: string): path is RelativeImagePath {
  return /^images\/(products|recipes)\/[^/]+\.jpg$/.test(path);
}

export function assertRelativeImagePath(path: string): asserts path is RelativeImagePath {
  if (!isRelativeImagePath(path)) {
    throw new Error('images.absolutePathRejected');
  }
}

export function resolveImageUri(relativePath: string | null | undefined, documentUri = 'file:///document/'): string | null {
  if (!relativePath) {
    return null;
  }

  assertRelativeImagePath(relativePath);
  return `${documentUri.replace(/\/?$/, '/')}${relativePath}`;
}
