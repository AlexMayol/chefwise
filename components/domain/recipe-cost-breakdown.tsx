import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { ListRow } from '@/components/ui/list-row';
import type { RecipeCostBreakdownItem } from '@/lib/domain/recipes';
import { formatCurrency } from '@/lib/formatting/currency';
import { useTranslation } from '@/lib/i18n';

type RecipeCostBreakdownProps = {
  totalCost?: number | null;
  costPerServing?: number | null;
  complete?: boolean;
  breakdown?: RecipeCostBreakdownItem[];
  productNamesById?: Record<string, string>;
};

export function RecipeCostBreakdown({
  totalCost = null,
  costPerServing = null,
  complete = true,
  breakdown = [],
  productNamesById = {},
}: RecipeCostBreakdownProps) {
  const { t } = useTranslation();

  return (
    <Card className="gap-2">
      <Text className="text-lg font-bold text-card-foreground">
        {t('recipes.totalCost')}: {totalCost === null ? t('common.missingPrice') : formatCurrency(totalCost)}
      </Text>
      <Text className="text-base text-muted-foreground">
        {t('recipes.costPerServing')}: {costPerServing === null ? t('common.missingPrice') : formatCurrency(costPerServing)}
      </Text>
      {!complete ? <Text className="text-sm text-destructive">{t('recipes.incompleteCost')}</Text> : null}
      {breakdown.map((item) => (
        <ListRow
          key={`${item.productId}-${item.priceId}`}
          title={productNamesById[item.productId] ?? item.productId}
          subtitle={formatCurrency(item.cost)}
        />
      ))}
    </Card>
  );
}
