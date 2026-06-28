export type ImageEntityType = 'product' | 'recipe' | 'market' | 'offer';
export type RelativeImagePath = `images/${'products' | 'recipes' | 'markets' | 'offers'}/${string}.jpg`;

const ENTITY_DIRECTORIES = { product: 'products', recipe: 'recipes', market: 'markets', offer: 'offers' } as const;

export function buildEntityImagePath(entityType: ImageEntityType, entityId: string): RelativeImagePath {
  return `images/${ENTITY_DIRECTORIES[entityType]}/${entityId}.jpg`;
}

export function isRelativeImagePath(path: string): path is RelativeImagePath {
  return /^images\/(products|recipes|markets|offers)\/[^/]+\.jpg$/.test(path);
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
