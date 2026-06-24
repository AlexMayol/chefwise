import JSZip from 'jszip';

export const BACKUP_VERSION = 1;

export type BackupManifest = {
  appName: 'Chefwise';
  backupVersion: number;
  exportedAt: string;
  databaseFile: 'database.sqlite';
  imageDirectory: 'images';
};

export type BackupExportResult = {
  archiveName: 'backup.zip';
  archiveBytes: Uint8Array;
  manifest: BackupManifest;
};

export type BackupValidationResult =
  | { ok: true }
  | { ok: false; reason: 'backup.invalidManifest' | 'backup.unsupportedVersion' };

export function validateBackupManifest(value: unknown): BackupValidationResult {
  if (!value || typeof value !== 'object') {
    return { ok: false, reason: 'backup.invalidManifest' };
  }

  const manifest = value as Partial<BackupManifest>;

  if (manifest.backupVersion !== BACKUP_VERSION) {
    return { ok: false, reason: 'backup.unsupportedVersion' };
  }

  if (
    manifest.appName !== 'Chefwise' ||
    manifest.databaseFile !== 'database.sqlite' ||
    manifest.imageDirectory !== 'images' ||
    !manifest.exportedAt
  ) {
    return { ok: false, reason: 'backup.invalidManifest' };
  }

  return { ok: true };
}

export async function exportBackup({
  databaseBytes,
  imageFiles = [],
}: {
  databaseBytes: Uint8Array;
  imageFiles?: Array<{ path: string; bytes: Uint8Array }>;
}): Promise<BackupExportResult> {
  const manifest: BackupManifest = {
    appName: 'Chefwise',
    backupVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    databaseFile: 'database.sqlite',
    imageDirectory: 'images',
  };

  const zip = new JSZip();
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  zip.file('database.sqlite', databaseBytes);

  for (const image of imageFiles) {
    zip.file(image.path, image.bytes);
  }

  const archiveBytes = await zip.generateAsync({ type: 'uint8array' });

  return {
    archiveName: 'backup.zip',
    archiveBytes,
    manifest,
  };
}

export async function validateBackupArchive(bytes: Uint8Array): Promise<BackupValidationResult> {
  const zip = await JSZip.loadAsync(bytes);
  const manifestFile = zip.file('manifest.json');
  const databaseFile = zip.file('database.sqlite');

  if (!manifestFile || !databaseFile) {
    return { ok: false, reason: 'backup.invalidManifest' };
  }

  const manifest = JSON.parse(await manifestFile.async('string')) as unknown;
  return validateBackupManifest(manifest);
}

export async function importBackup({
  archiveBytes,
  replaceLocalData,
}: {
  archiveBytes: Uint8Array;
  replaceLocalData(input: { databaseBytes: Uint8Array; imageFiles: Array<{ path: string; bytes: Uint8Array }> }): Promise<void>;
}): Promise<void> {
  const zip = await JSZip.loadAsync(archiveBytes);
  const manifestFile = zip.file('manifest.json');
  const databaseFile = zip.file('database.sqlite');

  if (!manifestFile || !databaseFile) {
    throw new Error('backup.invalidManifest');
  }

  const validation = validateBackupManifest(JSON.parse(await manifestFile.async('string')) as unknown);

  if (!validation.ok) {
    throw new Error(validation.reason);
  }

  const imageFiles = await Promise.all(
    Object.values(zip.files)
      .filter((file) => !file.dir && file.name.startsWith('images/'))
      .map(async (file) => ({ path: file.name, bytes: await file.async('uint8array') })),
  );

  await replaceLocalData({
    databaseBytes: await databaseFile.async('uint8array'),
    imageFiles,
  });
}
