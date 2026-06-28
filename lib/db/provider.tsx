import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { openAppDatabase, type AppDatabase } from './client';
import { runMigrations } from './migrations';
import { createAppRepositories, type AppRepositories } from './repositories';
import { i18n } from '@/lib/i18n';

type DatabaseContextValue = {
  db: AppDatabase;
  repositories: AppRepositories;
  // Closes the live connection, runs the on-disk swap, then reopens against the new file so
  // every screen re-queries the imported data. Reopens even if the swap throws, so a failed
  // import never leaves the app with a dead connection. Returns the result of `runImport`.
  importDatabase<T>(runImport: (beforeReplace: () => Promise<void>) => Promise<T>): Promise<T>;
};

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

export function AppDatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<AppDatabase | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    void openAppDatabase()
      .then(async (database) => {
        await runMigrations(database);
        if (mounted) {
          setDb(database);
        }
      })
      .catch((unknownError: unknown) => {
        if (mounted) {
          setError(unknownError instanceof Error ? unknownError : new Error(String(unknownError)));
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const importDatabase = useCallback(
    async <T,>(runImport: (beforeReplace: () => Promise<void>) => Promise<T>): Promise<T> => {
      let closed = false;
      try {
        return await runImport(async () => {
          await db?.closeAsync?.();
          closed = true;
        });
      } finally {
        if (closed) {
          const database = await openAppDatabase();
          await runMigrations(database);
          setDb(database);
        }
      }
    },
    [db],
  );

  const value = useMemo(
    () => (db ? { db, repositories: createAppRepositories(db), importDatabase } : null),
    [db, importDatabase],
  );

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-center text-destructive">{error.message}</Text>
      </View>
    );
  }

  if (!value) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-muted-foreground">{i18n.t('common.loading')}</Text>
      </View>
    );
  }

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useAppDatabase() {
  const value = useContext(DatabaseContext);

  if (!value) {
    throw new Error('useAppDatabase must be used within AppDatabaseProvider');
  }

  return value;
}
