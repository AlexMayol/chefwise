import { Link, type Href } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { MarketRow, type MarketRowItem } from '@/components/domain/market-row';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { SearchBar } from '@/components/ui/search-bar';
import { useColorScheme } from '@/components/useColorScheme';
import { marketStats } from '@/lib/domain/market-stats';
import { timeAgo } from '@/lib/formatting/relative-time';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useAllOffers } from '@/lib/hooks/use-product-offers';
import { useProducts } from '@/lib/hooks/use-products';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';
import { getDesignTokens } from '@/lib/theme/tokens';

export default function MarketsScreen() {
  const { t } = useTranslation();
  const tokens = getDesignTokens(useColorScheme());
  const [query, setQuery] = useState('');

  const { items: markets, loading, reload } = useMarkets();
  const { items: products, reload: reloadProducts } = useProducts();
  const { items: allOffers, reload: reloadOffers } = useAllOffers();

  useReloadOnFocus(
    useCallback(async () => {
      await Promise.all([reload(), reloadProducts(), reloadOffers()]);
    }, [reload, reloadProducts, reloadOffers]),
  );

  const productInfo = useMemo(
    () => new Map(products.map((product) => [product.id, { bestNormalizedPrice: product.bestNormalizedPrice, rating: product.rating }])),
    [products],
  );
  const offersByMarket = useMemo(() => {
    const map = new Map<string, typeof allOffers>();
    for (const offer of allOffers) {
      const list = map.get(offer.marketId) ?? [];
      list.push(offer);
      map.set(offer.marketId, list);
    }
    return map;
  }, [allOffers]);

  const rows = useMemo<MarketRowItem[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return markets
      .filter(
        (market) =>
          !normalizedQuery ||
          market.name.toLowerCase().includes(normalizedQuery) ||
          (market.address ?? '').toLowerCase().includes(normalizedQuery),
      )
      .map((market) => ({ market, stats: marketStats(offersByMarket.get(market.id) ?? [], productInfo) }))
      .map(({ market, stats }) => {
        const updated = stats.lastUpdated ? timeAgo(stats.lastUpdated) : null;
        return {
          id: market.id,
          name: market.name,
          address: market.address ?? undefined,
          imageUri: resolveEntityImageUri(market.imagePath) ?? undefined,
          productCountLabel: t('categories.productCount', { count: stats.productsTracked }),
          cheapestLabel: stats.cheapestCount > 0 ? t('markets.cheapestFor', { count: stats.cheapestCount }) : undefined,
          updatedLabel: updated ? t('markets.updatedAgo', { time: t(updated.key, { count: updated.count }) }) : undefined,
          href: `/markets/${market.id}` as Href,
        };
      });
  }, [markets, query, offersByMarket, productInfo, t]);

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <Text className="text-3xl font-bold tracking-tight text-foreground">{t('navigation.markets')}</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder={t('markets.searchPlaceholder')} />
        {loading && markets.length === 0 ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <EmptyState title={t('common.empty')} />
        ) : (
          <View className="gap-3">
            {rows.map((row) => (
              <MarketRow key={row.id} item={row} />
            ))}
          </View>
        )}
      </ScreenScaffold>

      <BottomActionBar>
        <Link href="/markets/new" asChild>
          <Button label={t('markets.new')} icon={<Plus size={18} color={tokens.primaryForeground} />} />
        </Link>
      </BottomActionBar>
    </View>
  );
}
