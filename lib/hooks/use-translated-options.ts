import { useMemo } from 'react';

import type { Unit } from '@/lib/domain/units';
import { useTranslation } from '@/lib/i18n';

export type Option<T extends string = string> = {
  label: string;
  value: T;
};

export function useUnitOptions(): Option<Unit>[] {
  return useMemo(
    () =>
      (['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'unit'] as Unit[]).map((unit) => ({
        label: unit,
        value: unit,
      })),
    [],
  );
}

export function useShoppingStatusOptions() {
  const { t } = useTranslation();

  return useMemo(
    () =>
      (['draft', 'active', 'completed', 'archived'] as const).map((status) => ({
        label: t(`shopping.${status}`),
        value: status,
      })),
    [t],
  );
}
