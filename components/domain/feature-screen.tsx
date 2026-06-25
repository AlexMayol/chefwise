import { Link, type Href } from 'expo-router';
import { Text, View } from 'react-native';
import type React from 'react';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { useTranslation } from '@/lib/i18n';
import { shouldRenderListEmptyState } from '@/lib/ui/feature-screen';

type FeatureScreenProps = {
  title: string;
  description?: string;
  emoji?: string;
  showBack?: boolean;
  addHref?: Href;
  addLabel?: string;
  rows?: Array<{ id: string; title: string; subtitle?: string; meta?: string; href?: Href }>;
  children?: React.ReactNode;
};

export function FeatureScreen({ title, description, emoji, showBack, addHref, addLabel, rows, children }: FeatureScreenProps) {
  const { t } = useTranslation();
  const hasList = rows !== undefined;

  return (
    <ScreenScaffold>
      <View className="gap-2">
        <View className="flex-row items-center gap-3">
          {showBack ? <BackButton /> : null}
          {emoji ? <Text className="text-3xl">{emoji}</Text> : null}
          <Text className="flex-1 text-3xl font-bold tracking-tight text-foreground">{title}</Text>
        </View>
        {description ? <Text className="text-base text-muted-foreground">{description}</Text> : null}
      </View>
      {addHref ? (
        <Link href={addHref} asChild>
          <Button label={addLabel ?? t('actions.add')} />
        </Link>
      ) : null}
      {children ? <Card className="gap-4">{children}</Card> : null}
      {shouldRenderListEmptyState(rows) ? (
        <EmptyState title={t('common.empty')} />
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
    </ScreenScaffold>
  );
}
