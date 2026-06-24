import { Link, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { useTranslation } from '@/lib/i18n';
import { shouldRenderListEmptyState } from '@/lib/ui/feature-screen';

type FeatureScreenProps = {
  title: string;
  description: string;
  addHref?: Href;
  addLabel?: string;
  rows?: Array<{ id: string; title: string; subtitle?: string; meta?: string; href?: Href }>;
  children?: React.ReactNode;
};

export function FeatureScreen({ title, description, addHref, addLabel, rows, children }: FeatureScreenProps) {
  const { t } = useTranslation();
  const hasList = rows !== undefined;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <View className="gap-2">
        <Text className="text-3xl font-bold text-foreground">{title}</Text>
        <Text className="text-base text-muted-foreground">{description}</Text>
      </View>
      {addHref ? (
        <Link href={addHref} asChild>
          <Button label={addLabel ?? t('actions.add')} />
        </Link>
      ) : null}
      {children ? <Card className="gap-4">{children}</Card> : null}
      {shouldRenderListEmptyState(rows) ? (
        <EmptyState title={t('common.empty')} description={t('common.offline')} />
      ) : null}
      {hasList && rows.length > 0
        ? (
        rows.map((row) =>
          row.href ? (
            <Link key={row.id} href={row.href} asChild>
              <ListRow title={row.title} subtitle={row.subtitle} meta={row.meta} />
            </Link>
          ) : (
            <ListRow key={row.id} title={row.title} subtitle={row.subtitle} meta={row.meta} />
          ),
        )
          )
        : null}
    </ScrollView>
  );
}
