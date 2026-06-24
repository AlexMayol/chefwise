import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { useTranslation } from '@/lib/i18n';

type ShoppingItemRowProps = {
  title: string;
  quantity: string;
};

export function ShoppingItemRow({ title, quantity }: ShoppingItemRowProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-2">
      <ListRow title={title} subtitle={quantity} />
      <View className="flex-row gap-2">
        <Button className="flex-1" label={t('actions.markBought')} />
        <Button className="flex-1" label={t('actions.skip')} variant="ghost" />
      </View>
    </View>
  );
}
