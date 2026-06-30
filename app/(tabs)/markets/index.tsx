import { type Href } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MarketForm, type MarketFormHandle } from '@/components/domain/market-form';
import { MarketRow, type MarketRowItem } from '@/components/domain/market-row';
import { EntityActionMenuSheet } from '@/components/ui/entity-action-menu-sheet';
import { EntityEditSheet } from '@/components/ui/entity-edit-sheet';
import { ListingContent } from '@/components/ui/listing-content';
import { ListingScreenHeader } from '@/components/ui/listing-screen-header';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { SearchBar } from '@/components/ui/search-bar';
import type { Market } from '@/lib/db/repositories/markets';
import { marketStats } from '@/lib/domain/market-stats';
import { useListingQuickActions } from '@/lib/hooks/use-entity-quick-actions';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useAllOffers } from '@/lib/hooks/use-product-offers';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';

export default function MarketsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const editFormRef = useRef<MarketFormHandle>(null);
  const actions = useListingQuickActions<Market>();

  const { items: markets, loading, reload, update, remove } = useMarkets();
  const { items: allOffers, reload: reloadOffers } = useAllOffers();

  useReloadOnFocus(reload, reloadOffers);

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
      .map((market) => {
        const stats = marketStats(offersByMarket.get(market.id) ?? [], new Map());
        const productCount = t('categories.productCount', { count: stats.productsTracked });
        const subtitle = market.address ? `${productCount} · ${market.address}` : productCount;

        return {
          id: market.id,
          name: market.name,
          subtitle,
          imageUri: resolveEntityImageUri(market.imagePath) ?? undefined,
          href: `/markets/${market.id}` as Href,
        };
      });
  }, [markets, query, offersByMarket, t]);

  const newMarketHref = '/markets/new' as Href;

  const actionSubtitle = useMemo(() => {
    if (!actions.entity) return undefined;
    return rows.find((entry) => entry.id === actions.entity!.id)?.subtitle;
  }, [actions.entity, rows]);

  function openActions(marketId: string) {
    const market = markets.find((entry) => entry.id === marketId);
    if (market) actions.open(market);
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <ListingScreenHeader title={t('markets.title')} newHref={newMarketHref} newLabel={t('markets.new')} />
        <SearchBar value={query} onChangeText={setQuery} placeholder={t('markets.searchPlaceholder')} />
        <ListingContent
          loading={loading}
          sourceEmpty={markets.length === 0}
          itemCount={rows.length}
          query={query}
          newHref={newMarketHref}
          newLabel={t('markets.new')}
          emptyTitle={t('common.empty')}>
          {rows.map((row) => (
            <MarketRow key={row.id} item={row} onLongPress={() => openActions(row.id)} />
          ))}
        </ListingContent>
      </ScreenScaffold>

      {actions.entity ? (
        <>
          <EntityActionMenuSheet
            visible={actions.menuVisible}
            onClose={actions.close}
            bottomInset={insets.bottom}
            title={actions.entity.name}
            subtitle={actionSubtitle}
            imageUri={resolveEntityImageUri(actions.entity.imagePath) ?? undefined}
            emoji="🏪"
            editLabel={t('markets.edit')}
            deleteError={actions.deleteError}
            onEdit={actions.beginEdit}
            onDelete={() => void actions.remove(remove, actions.entity!.id)}
          />
          <EntityEditSheet
            visible={actions.editVisible}
            onClose={actions.close}
            bottomInset={insets.bottom}
            title={t('markets.edit')}
            onSave={() => editFormRef.current?.submit()}>
            <MarketForm
              ref={editFormRef}
              initialValues={actions.entity}
              hideSubmit
              onSubmit={async (values) => {
                await update(actions.entity!.id, values);
                actions.close();
              }}
            />
          </EntityEditSheet>
        </>
      ) : null}
    </View>
  );
}
