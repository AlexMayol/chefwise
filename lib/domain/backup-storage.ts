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

function databaseDirectory() {
  return APP_DATABASE_DIRECTORY ?? Paths.document;
}

function getDatabaseFile() {
  return new File(databaseDirectory(), APP_DATABASE_NAME);
}

// The live SQLite connection keeps the main file plus its WAL/SHM/journal sidecars. Replacing
// only the main file leaves a stale WAL that gets replayed over the imported data on next open.
function databaseFilesToClear() {
  return ['', '-wal', '-shm', '-journal'].map((suffix) => new File(databaseDirectory(), `${APP_DATABASE_NAME}${suffix}`));
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

export async function replaceLocalBackupData(
  {
    databaseBytes,
    imageFiles,
  }: {
    databaseBytes: Uint8Array;
    imageFiles: Array<{ path: string; bytes: Uint8Array }>;
  },
  // beforeReplace closes the live SQLite connection so the db file can be safely swapped.
  // It runs after staging (so a staging failure leaves the connection untouched) but before
  // any destructive change to the live document directory.
  options: { beforeReplace?: () => Promise<void> } = {},
): Promise<void> {
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

    await options.beforeReplace?.();

    for (const file of databaseFilesToClear()) {
      if (file.exists) {
        file.delete();
      }
    }
    await stagedDatabase.copy(getDatabaseFile());

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

// Returns true when a backup was imported, false when the user canceled the picker.
export async function pickAndValidateBackup(
  replaceLocalData: Parameters<typeof importBackup>[0]['replaceLocalData'] = replaceLocalBackupData,
): Promise<boolean> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/zip',
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets[0]?.uri) {
    return false;
  }

  await importBackup({
    archiveBytes: await new File(result.assets[0].uri).bytes(),
    replaceLocalData,
  });

  return true;
}
