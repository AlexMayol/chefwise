import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useTranslation } from '@/lib/i18n';

import { Card } from './card';

// A numbered, card-wrapped form step. The shared section style for every form
// (product, category, market, recipe, shopping, pantry).
export function FormSection({
  step,
  title,
  optional,
  children,
}: {
  step: number;
  title: string;
  optional?: boolean;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <Card className="gap-4">
      <View className="flex-row items-center gap-2.5">
        <View className="size-7 items-center justify-center rounded-full bg-primary">
          <Text className="text-xs font-bold text-primary-foreground">{step}</Text>
        </View>
        <Text className="text-base font-bold text-foreground">{title}</Text>
        {optional ? <Text className="text-sm text-muted-foreground">{t('forms.optional')}</Text> : null}
      </View>
      {children}
    </Card>
  );
}
