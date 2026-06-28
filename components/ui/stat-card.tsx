import type { ReactNode } from 'react';
import { Text } from 'react-native';

import { Card } from './card';

// A compact metric tile: icon, value, label. Used by the category/market "at a glance" grids.
export function StatCard({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <Card className="flex-1 items-center gap-1 px-2 py-3">
      {icon}
      <Text className="text-lg font-bold text-card-foreground">{value}</Text>
      <Text className="text-center text-xs text-muted-foreground" numberOfLines={2}>
        {label}
      </Text>
    </Card>
  );
}
