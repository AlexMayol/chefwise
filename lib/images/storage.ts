import * as FileSystem from 'expo-file-system';
import { Directory, File, Paths } from 'expo-file-system';

import { assertRelativeImagePath, buildEntityImagePath, resolveImageUri, type ImageEntityType, type RelativeImagePath } from './paths';

const ENTITY_DIRECTORIES: Record<ImageEntityType, string> = { product: 'products', recipe: 'recipes', market: 'markets' };

function getDocumentUri(): string {
  const legacyFileSystem = FileSystem as unknown as { documentDirectory?: string };

  try {
    return Paths.document.uri;
  } catch {
    return legacyFileSystem.documentDirectory ?? 'file:///document/';
  }
}

function createImageDirectory(entityType: ImageEntityType): void {
  const imageDirectory = new Directory(getDocumentUri(), 'images', ENTITY_DIRECTORIES[entityType]);

  if (!imageDirectory.exists) {
    imageDirectory.create({ intermediates: true });
  }
}

export async function saveEntityImage(
  entityType: ImageEntityType,
  entityId: string,
  sourceUri: string,
): Promise<RelativeImagePath> {
  const relativePath = buildEntityImagePath(entityType, entityId);
  const targetUri = resolveImageUri(relativePath, getDocumentUri());

  if (!targetUri) {
    throw new Error('images.invalidTarget');
  }

  const fs = FileSystem as unknown as {
    copyAsync?: (options: { from: string; to: string }) => Promise<void>;
  };

  if (File && Directory) {
    createImageDirectory(entityType);
    const source = new File(sourceUri);
    const destination = new File(getDocumentUri(), relativePath);
    if (destination.exists) {
      destination.delete();
    }
    await source.copy(destination);
  } else if (fs.copyAsync) {
    await fs.copyAsync({ from: sourceUri, to: targetUri });
  }

  return relativePath;
}

export async function deleteEntityImage(relativePath: string | null | undefined): Promise<void> {
  if (!relativePath) {
    return;
  }

  assertRelativeImagePath(relativePath);

  const fs = FileSystem as unknown as {
    File?: new (base: { uri: string } | string, path?: string) => { delete(): void };
    deleteAsync?: (uri: string, options?: { idempotent?: boolean }) => Promise<void>;
  };

  if (fs.File) {
    new fs.File(getDocumentUri(), relativePath).delete();
  } else if (fs.deleteAsync) {
    await fs.deleteAsync(resolveImageUri(relativePath, getDocumentUri()) ?? '', { idempotent: true });
  }
}

export function resolveEntityImageUri(relativePath: string | null | undefined): string | null {
  return resolveImageUri(relativePath, getDocumentUri());
}

export { resolveImageUri };
