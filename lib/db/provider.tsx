import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { openAppDatabase, type AppDatabase } from './client';
import { runMigrations } from './migrations';
import { createAppRepositories, type AppRepositories } from './repositories';
import { i18n } from '@/lib/i18n';

type DatabaseContextValue = {
  db: AppDatabase;
  repositories: AppRepositories;
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

  const value = useMemo(() => (db ? { db, repositories: createAppRepositories(db) } : null), [db]);

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
