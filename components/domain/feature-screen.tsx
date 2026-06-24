import { Link, useRouter, type Href } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  emoji?: string;
  showBack?: boolean;
  addHref?: Href;
  addLabel?: string;
  rows?: Array<{ id: string; title: string; subtitle?: string; meta?: string; href?: Href }>;
  children?: React.ReactNode;
};

export function FeatureScreen({ title, description, emoji, showBack, addHref, addLabel, rows, children }: FeatureScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hasList = rows !== undefined;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 16, paddingHorizontal: 20 }}>

      <View className="gap-2">
        <View className="flex-row items-center gap-3">
          {showBack ? (
            // ponytail: ← glyph instead of SymbolView — token-themed, cross-platform, no tint prop
            <Pressable onPress={() => router.back()} hitSlop={8} className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-70">
              <Text className="text-xl font-semibold text-foreground">←</Text>
            </Pressable>
          ) : null}
          {emoji ? <Text className="text-3xl">{emoji}</Text> : null}
          <Text className="flex-1 text-3xl font-bold tracking-tight text-foreground">{title}</Text>
        </View>
        <Text className="text-base text-muted-foreground">{description}</Text>
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
    </ScrollView>
  );
}
