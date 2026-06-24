import { exportBackup, importBackup, validateBackupManifest } from '@/lib/domain/backup';

describe('backup validation', () => {
  it('accepts supported backup manifests', () => {
    expect(
      validateBackupManifest({
        appName: 'Chefwise',
        backupVersion: 1,
        exportedAt: new Date().toISOString(),
        databaseFile: 'database.sqlite',
        imageDirectory: 'images',
      }),
    ).toEqual({ ok: true });
  });

  it('rejects unsupported versions and missing database files', () => {
    expect(validateBackupManifest({ appName: 'Chefwise', backupVersion: 99, databaseFile: 'database.sqlite' })).toEqual({
      ok: false,
      reason: 'backup.unsupportedVersion',
    });
    expect(validateBackupManifest({ appName: 'Chefwise', backupVersion: 1 })).toEqual({
      ok: false,
      reason: 'backup.invalidManifest',
    });
  });

  it('validates a backup archive before replacing local data', async () => {
    const backup = await exportBackup({ databaseBytes: new Uint8Array([1, 2, 3]) });
    const replaceLocalData = jest.fn(async () => undefined);

    await importBackup({ archiveBytes: backup.archiveBytes, replaceLocalData });

    expect(replaceLocalData).toHaveBeenCalledWith(expect.objectContaining({ databaseBytes: expect.any(Uint8Array) }));
  });
});
