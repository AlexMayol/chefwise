import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';

import { APP_DATABASE_DIRECTORY, APP_DATABASE_NAME } from '@/lib/db/client';
import { exportBackup, importBackup, type BackupExportResult } from './backup';

export type LocalBackupSource = {
  databaseBytes?: Uint8Array;
  databaseFileUri?: string;
  imagePaths?: string[];
};

type CollectableFileSystemEntry = {
  name: string;
  exists?: boolean;
  list?: () => CollectableFileSystemEntry[];
  bytes?: () => Promise<Uint8Array>;
};

type CollectableDirectory = CollectableFileSystemEntry & {
  exists: boolean;
  list: () => CollectableFileSystemEntry[];
};

function getDatabaseFile() {
  return APP_DATABASE_DIRECTORY ? new File(APP_DATABASE_DIRECTORY, APP_DATABASE_NAME) : new File(Paths.document, APP_DATABASE_NAME);
}

function isDirectoryEntry(entry: CollectableFileSystemEntry): entry is CollectableDirectory {
  return typeof entry.list === 'function';
}

function isFileEntry(entry: CollectableFileSystemEntry): boolean {
  return typeof entry.bytes === 'function';
}

export function collectRelativeFilePaths(directory: CollectableDirectory, relativePath = directory.name): string[] {
  if (!directory.exists) {
    return [];
  }

  return directory.list().flatMap((entry) => {
    const entryPath = `${relativePath}/${entry.name}`;

    if (isDirectoryEntry(entry)) {
      return collectRelativeFilePaths(entry, entryPath);
    }

    return isFileEntry(entry) ? [entryPath] : [];
  });
}

export async function exportBackupToCache({ databaseBytes: providedBytes, databaseFileUri, imagePaths = [] }: LocalBackupSource): Promise<BackupExportResult & { uri: string }> {
  const resolvedImagePaths = imagePaths.length > 0 ? imagePaths : collectRelativeFilePaths(new Directory(Paths.document, 'images'));
  const databaseBytes = providedBytes ?? (await (databaseFileUri ? new File(databaseFileUri) : getDatabaseFile()).bytes());
  const imageFiles = await Promise.all(
    resolvedImagePaths.map(async (path) => ({
      path,
      bytes: await new File(Paths.document, path).bytes(),
    })),
  );
  const backup = await exportBackup({ databaseBytes, imageFiles });
  const archive = new File(Paths.cache, backup.archiveName);

  if (archive.exists) {
    archive.delete();
  }

  archive.create();
  archive.write(backup.archiveBytes);

  return { ...backup, uri: archive.uri };
}

export async function replaceLocalBackupData({
  databaseBytes,
  imageFiles,
}: {
  databaseBytes: Uint8Array;
  imageFiles: Array<{ path: string; bytes: Uint8Array }>;
}): Promise<void> {
  const stagingDirectory = new Directory(Paths.cache, 'backup-import-staging');

  if (stagingDirectory.exists) {
    stagingDirectory.delete();
  }

  try {
    stagingDirectory.create({ intermediates: true });

    const stagedDatabase = new File(stagingDirectory, APP_DATABASE_NAME);
    stagedDatabase.create();
    stagedDatabase.write(databaseBytes);

    const stagedImagesDirectory = new Directory(stagingDirectory, 'images');
    stagedImagesDirectory.create({ intermediates: true });

    for (const image of imageFiles) {
      const pathParts = image.path.split('/').filter(Boolean);
      const fileName = pathParts.pop();

      if (!fileName) {
        continue;
      }

      const directory = new Directory(stagingDirectory, ...pathParts);
      if (!directory.exists) {
        directory.create({ intermediates: true });
      }

      const file = new File(directory, fileName);
      file.create();
      file.write(image.bytes);
    }

    const databaseFile = getDatabaseFile();
    if (databaseFile.exists) {
      databaseFile.delete();
    }
    await stagedDatabase.copy(databaseFile);

    const imagesDirectory = new Directory(Paths.document, 'images');
    if (imagesDirectory.exists) {
      imagesDirectory.delete();
    }
    await stagedImagesDirectory.copy(imagesDirectory);
  } finally {
    if (stagingDirectory.exists) {
      stagingDirectory.delete();
    }
  }
}

export async function pickAndValidateBackup(
  replaceLocalData: Parameters<typeof importBackup>[0]['replaceLocalData'] = replaceLocalBackupData,
): Promise<void> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/zip',
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets[0]?.uri) {
    return;
  }

  await importBackup({
    archiveBytes: await new File(result.assets[0].uri).bytes(),
    replaceLocalData,
  });
}
