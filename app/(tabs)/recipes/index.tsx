import { Link, useRouter, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RecipeCard, type RecipeCardItem } from '@/components/domain/recipe-card';
import { RecipeCategoryChips, type RecipeChip } from '@/components/domain/recipe-category-chips';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ListingContent } from '@/components/ui/listing-content';
import { ListingScreenHeader } from '@/components/ui/listing-screen-header';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { SearchBar } from '@/components/ui/search-bar';
import { Select } from '@/components/ui/select';
import { TipCard } from '@/components/ui/tip-card';
import { formatCurrency } from '@/lib/formatting/currency';
import { timeAgo } from '@/lib/formatting/relative-time';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { useRecipeCategories } from '@/lib/hooks/use-recipe-categories';
import { useRecipeOverviews } from '@/lib/hooks/use-recipes';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';

type RecipeSort = 'recent' | 'name';

export default function RecipesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const tokens = useDesignTokens();
  const insets = useSafeAreaInsets();
  const { items: overviews, loading, reload } = useRecipeOverviews();
  const { items: categories, reload: reloadCategories } = useRecipeCategories();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'favorites' | categoryId
  const [sort, setSort] = useState<RecipeSort>('recent');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useReloadOnFocus(reload, reloadCategories);

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const chips = useMemo<RecipeChip[]>(() => {
    const base: RecipeChip[] = [
      { key: 'all', label: t('recipes.all'), count: overviews.length },
      {
        key: 'favorites',
        label: t('recipes.favorites'),
        emoji: '⭐',
        count: overviews.filter((r) => r.isFavorite).length,
      },
    ];
    const categoryChips = categories.map((category) => ({
      key: category.id,
      label: category.name,
      emoji: category.emoji ?? undefined,
      count: overviews.filter((r) => r.recipeCategoryId === category.id).length,
    }));
    return [...base, ...categoryChips];
  }, [categories, overviews, t]);

  const rows = useMemo<RecipeCardItem[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = overviews.filter((recipe) => {
      if (normalizedQuery) {
        const haystack = `${recipe.name} ${recipe.description ?? ''}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      if (filter === 'favorites') return recipe.isFavorite;
      if (filter !== 'all') return recipe.recipeCategoryId === filter;
      return true;
    });

    const sorted = [...filtered].sort((a, b) =>
      sort === 'name' ? a.name.localeCompare(b.name) : b.updatedAt.localeCompare(a.updatedAt),
    );

    return sorted.map((recipe) => {
      const category = recipe.recipeCategoryId ? categoryById.get(recipe.recipeCategoryId) : undefined;
      // servings is optional (0 = unset) — omit it from the meta line when absent.
      const servingsLabel = recipe.servings > 0 ? t('recipes.servingsCount', { count: recipe.servings }) : null;
      const updated = timeAgo(recipe.updatedAt);
      return {
        id: recipe.id,
        name: recipe.name,
        imageUri: resolveEntityImageUri(recipe.imagePath) ?? undefined,
        categoryEmoji: category?.emoji ?? '🍳',
        metaLabel: [category ? `${category.emoji ?? ''} ${category.name}` : null, servingsLabel].filter(Boolean).join(' · '),
        ingredientEmojis: recipe.ingredientEmojis,
        hasPrice: recipe.totalCost != null,
        priceLabel: recipe.totalCost != null ? formatCurrency(recipe.totalCost) : t('common.noPriceYet'),
        perServingLabel:
          recipe.costPerServing != null
            ? t('recipes.perServing', { price: formatCurrency(recipe.costPerServing) })
            : undefined,
        updatedLabel: t('recipes.updatedAgo', { time: t(updated.key, { count: updated.count }) }),
        isFavorite: recipe.isFavorite,
        href: `/recipes/${recipe.id}` as Href,
      };
    });
  }, [overviews, query, filter, sort, categoryById, t]);

  const newRecipeHref = '/recipes/new' as Href;

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <ListingScreenHeader title={t('recipes.title')} newHref={newRecipeHref} newLabel={t('recipes.new')} />

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t('recipes.searchPlaceholder')}
          onFilter={() => setFiltersOpen(true)}
          filterActive={sort !== 'recent'}
          filterLabel={t('common.filters')}
        />

        <RecipeCategoryChips chips={chips} value={filter} onChange={setFilter} />

        <ListingContent
          loading={loading}
          sourceEmpty={overviews.length === 0}
          itemCount={rows.length}
          query={query}
          newHref={newRecipeHref}
          newLabel={t('recipes.new')}
          emptyTitle={t('common.empty')}>
          {rows.map((row) => (
            <RecipeCard key={row.id} item={row} />
          ))}
        </ListingContent>

        <Link href="/recipe-categories" asChild>
          <Pressable className="active:opacity-80">
            <TipCard title={t('recipes.automaticallyPricedTitle')}>{t('recipes.automaticallyPricedSubtitle')}</TipCard>
          </Pressable>
        </Link>
      </ScreenScaffold>

      <BottomSheet visible={filtersOpen} onClose={() => setFiltersOpen(false)} bottomInset={insets.bottom}>
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-foreground">{t('common.filters')}</Text>
            <Button label={t('actions.done')} variant="ghost" size="sm" onPress={() => setFiltersOpen(false)} />
          </View>
          <FormField label={t('recipes.sortBy')}>
            <Select<RecipeSort>
              value={sort}
              onChange={setSort}
              options={[
                { label: t('recipes.sortRecentlyUpdated'), value: 'recent' },
                { label: t('recipes.sortName'), value: 'name' },
              ]}
            />
          </FormField>
          <Pressable
            className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 active:opacity-80"
            onPress={() => {
              setFiltersOpen(false);
              router.push('/recipe-categories');
            }}>
            <Text className="text-base text-foreground">{t('recipes.manageCategories')}</Text>
            <ChevronRight size={18} color={tokens.mutedForeground} />
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
}
