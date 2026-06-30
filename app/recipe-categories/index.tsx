import { useRouter, type Href } from 'expo-router';
import { ChevronRight, Plus } from 'lucide-react-native';
import { useMemo, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { DetailHeader } from '@/components/ui/detail-header';
import { EntityAvatar } from '@/components/ui/entity-avatar';
import { IconButton } from '@/components/ui/icon-button';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { TipCard } from '@/components/ui/tip-card';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { useRecipeCategories } from '@/lib/hooks/use-recipe-categories';
import { useRecipes } from '@/lib/hooks/use-recipes';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

function Row({
  emoji,
  title,
  subtitle,
  separator,
  onPress,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  separator: boolean;
  onPress?: () => void;
}) {
  const tokens = useDesignTokens();
  const content: ReactNode = (
    <View className={cn('flex-row items-center gap-3 py-3', separator && 'border-t border-border')}>
      <EntityAvatar emoji={emoji} size={40} />
      <View className="flex-1">
        <Text className="text-base font-semibold text-card-foreground">{title}</Text>
        <Text className="text-sm text-muted-foreground">{subtitle}</Text>
      </View>
      {onPress ? <ChevronRight size={18} color={tokens.mutedForeground} /> : null}
    </View>
  );
  return onPress ? (
    <Pressable className="active:opacity-70" onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    content
  );
}

export default function RecipeCategoriesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const tokens = useDesignTokens();
  const { items: categories, reload } = useRecipeCategories();
  const { items: recipes, reload: reloadRecipes } = useRecipes();

  useReloadOnFocus(reload);
  useReloadOnFocus(reloadRecipes);

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const recipe of recipes) {
      if (recipe.recipeCategoryId) {
        counts.set(recipe.recipeCategoryId, (counts.get(recipe.recipeCategoryId) ?? 0) + 1);
      }
    }
    return counts;
  }, [recipes]);

  const uncategorizedCount = recipes.filter((recipe) => !recipe.recipeCategoryId).length;

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <DetailHeader>
          <IconButton accessibilityLabel={t('recipeCategories.new')} onPress={() => router.push('/recipe-categories/new')}>
            <Plus size={20} color={tokens.foreground} />
          </IconButton>
        </DetailHeader>

        <View className="gap-1">
          <Text className="text-2xl font-bold tracking-tight text-foreground">{t('recipeCategories.title')}</Text>
          <Text className="text-base text-muted-foreground">{t('recipeCategories.description')}</Text>
        </View>

        <Card className="gap-0 px-4 py-1">
          {categories.map((category, index) => (
            <Row
              key={category.id}
              separator={index > 0}
              emoji={category.emoji ?? '🍽️'}
              title={category.name}
              subtitle={t('recipeCategories.recipeCount', { count: countByCategory.get(category.id) ?? 0 })}
              onPress={() => router.push(`/recipe-categories/${category.id}` as Href)}
            />
          ))}
          <Row
            separator={categories.length > 0}
            emoji="🍽️"
            title={t('common.uncategorized')}
            subtitle={t('recipeCategories.recipeCount', { count: uncategorizedCount })}
          />
        </Card>

        <TipCard title={t('common.tip')}>{t('recipeCategories.tip')}</TipCard>
      </ScreenScaffold>
    </View>
  );
}
