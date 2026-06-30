import { Link, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { ChevronRight, Clock, MoreVertical, Package, Tag } from 'lucide-react-native';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddProductsSheet } from '@/components/domain/add-products-sheet';
import { MarketForm, type MarketFormHandle } from '@/components/domain/market-form';
import { EntityActionMenuSheet } from '@/components/ui/entity-action-menu-sheet';
import { EntityEditSheet } from '@/components/ui/entity-edit-sheet';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DetailHeader } from '@/components/ui/detail-header';
import { EmptyState } from '@/components/ui/empty-state';
import { EntityAvatar, LIST_THUMB_SIZE } from '@/components/ui/entity-avatar';
import { IconButton } from '@/components/ui/icon-button';
import { LoadingState } from '@/components/ui/loading-state';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';

import type { MarketOfferListItem } from '@/lib/db/repositories/product-offers';
import { marketStats } from '@/lib/domain/market-stats';
import { formatCurrency } from '@/lib/formatting/currency';
import { timeAgo } from '@/lib/formatting/relative-time';
import { useCategories } from '@/lib/hooks/use-categories';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { useDetailActionMenu } from '@/lib/hooks/use-entity-quick-actions';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useMarketOffers } from '@/lib/hooks/use-product-offers';
import { useProducts } from '@/lib/hooks/use-products';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';
import { productEmoji } from '@/lib/ui/category-emoji';
import { cn } from '@/lib/utils';

const MARKET_EMOJI = '🏪';

export default function MarketDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useDesignTokens();
  const { marketId } = useLocalSearchParams<{ marketId: string }>();
  const { items: markets, update, remove } = useMarkets();
  const { items: products } = useProducts();
  const { items: categories } = useCategories();
  const { items: offers, create, remove: removeOffer, reload } = useMarketOffers(marketId);

  const [editing, setEditing] = useState(false);
  const editFormRef = useRef<MarketFormHandle>(null);
  const menu = useDetailActionMenu({ onDeleteSuccess: () => router.back() });
  const [adding, setAdding] = useState(false);

  useReloadOnFocus(reload);

  const market = markets.find((item) => item.id === marketId);

  const productInfo = useMemo(
    () => new Map(products.map((product) => [product.id, { bestNormalizedPrice: product.bestNormalizedPrice }])),
    [products],
  );
  const productGlyph = useMemo(
    () => new Map(products.map((product) => [product.id, productEmoji(product.categoryId, categories)])),
    [products, categories],
  );
  const stats = useMemo(() => marketStats(offers, productInfo), [offers, productInfo]);

  // Products already tracked here show pre-selected in the picker; de-selecting removes their offers.
  const addedProductIds = useMemo(() => new Set(offers.map((offer) => offer.productId)), [offers]);

  const updatedLabel = (iso: string | null) => {
    if (!iso) return undefined;
    const { key, count } = timeAgo(iso);
    return t('markets.updatedAgo', { time: t(key, { count }) });
  };

  const marketActionSubtitle = useMemo(() => {
    const productCount = t('categories.productCount', { count: stats.productsTracked });
    return market?.address ? `${productCount} · ${market.address}` : productCount;
  }, [market?.address, stats.productsTracked, t]);

  if (!market) {
    return (
      <ScreenScaffold>
        <DetailHeader />
        <LoadingState />
      </ScreenScaffold>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <DetailHeader>
          <IconButton accessibilityLabel={t('actions.more')} onPress={menu.openMenu}>
            <MoreVertical size={20} color={tokens.foreground} />
          </IconButton>
        </DetailHeader>

        <View className="flex-row items-center gap-4">
          <EntityAvatar imageUri={resolveEntityImageUri(market.imagePath) ?? undefined} emoji={MARKET_EMOJI} size={72} circle />
          <View className="flex-1 gap-1">
            <Text className="text-2xl font-bold tracking-tight text-foreground">{market.name}</Text>
            {market.address ? <Text className="text-base text-muted-foreground">{market.address}</Text> : null}
            <View className="mt-1 flex-row flex-wrap gap-x-4 gap-y-1">
              <Meta icon={<Package size={13} color={tokens.primary} />} text={t('categories.productCount', { count: stats.productsTracked })} />
              {stats.cheapestCount > 0 ? (
                <Meta icon={<Tag size={13} color={tokens.mutedForeground} />} text={t('markets.cheapestFor', { count: stats.cheapestCount })} />
              ) : null}
              {updatedLabel(stats.lastUpdated) ? (
                <Meta icon={<Clock size={13} color={tokens.mutedForeground} />} text={updatedLabel(stats.lastUpdated)!} />
              ) : null}
            </View>
          </View>
        </View>

        {offers.length > 0 ? (
          <Card className="gap-0 px-4 py-1">
            {offers.map((offer, index) => (
              <OfferLine
                key={offer.id}
                offer={offer}
                imageUri={resolveEntityImageUri(offer.imagePath) ?? undefined}
                emoji={productGlyph.get(offer.productId)}
                separator={index > 0}
                noPriceLabel={t('common.noPriceYet')}
              />
            ))}
          </Card>
        ) : (
          <EmptyState title={t('common.empty')} />
        )}
      </ScreenScaffold>

      <BottomActionBar withSafeArea>
        <View className="flex-row gap-3">
          <Button className="flex-1" label={t('products.addProduct')} onPress={() => setAdding(true)} />
          <Button
            className="flex-1"
            variant="ghost"
            label={t('products.createProduct')}
            onPress={() => router.push({ pathname: '/products/new', params: { marketId } })}
          />
        </View>
      </BottomActionBar>

      <AddProductsSheet
        visible={adding}
        onClose={() => setAdding(false)}
        products={products}
        initialSelectedIds={addedProductIds}
        bottomInset={insets.bottom}
        // Create a default offer (size 1, product's unit, no brand) per selected product.
        onAdd={async (ids) => {
          await Promise.all(
            ids.map((id) => {
              const product = products.find((entry) => entry.id === id);
              return create({ productId: id, marketId, quantity: 1, unit: product?.defaultUnit ?? 'unit' });
            }),
          );
        }}
        // De-selecting a product deletes every offer it has at this market (incl. brand/price variants).
        onRemove={async (ids) => {
          const drop = new Set(ids);
          await Promise.all(offers.filter((offer) => drop.has(offer.productId)).map((offer) => removeOffer(offer.id)));
        }}
      />

      <EntityEditSheet
        visible={editing}
        onClose={() => setEditing(false)}
        bottomInset={insets.bottom}
        title={t('markets.edit')}
        onSave={() => editFormRef.current?.submit()}>
        <MarketForm
          ref={editFormRef}
          initialValues={market}
          hideSubmit
          onSubmit={async (values) => {
            await update(marketId, values);
            setEditing(false);
          }}
        />
      </EntityEditSheet>

      <EntityActionMenuSheet
        visible={menu.menuOpen}
        onClose={menu.closeMenu}
        bottomInset={insets.bottom}
        title={market.name}
        subtitle={marketActionSubtitle}
        imageUri={resolveEntityImageUri(market.imagePath) ?? undefined}
        emoji={MARKET_EMOJI}
        editLabel={t('markets.edit')}
        deleteError={menu.deleteError}
        onEdit={() => {
          menu.closeMenu();
          setEditing(true);
        }}
        onDelete={() => void menu.remove(() => remove(marketId))}
      />
    </View>
  );
}

function Meta({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <View className="flex-row items-center gap-1">
      {icon}
      <Text className="text-xs text-muted-foreground" numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

function OfferLine({
  offer,
  imageUri,
  emoji,
  separator,
  noPriceLabel,
}: {
  offer: MarketOfferListItem;
  imageUri?: string;
  emoji?: string;
  separator?: boolean;
  noPriceLabel: string;
}) {
  const tokens = useDesignTokens();

  return (
    <Link href={`/offers/${offer.id}` as Href} asChild>
      <Pressable className={cn('flex-row items-center gap-3 py-3 active:opacity-70', separator && 'border-t border-border')}>
        <EntityAvatar imageUri={imageUri} emoji={emoji ?? '🥕'} size={LIST_THUMB_SIZE} />
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-card-foreground" numberOfLines={1}>
            {offer.productName ?? ''}
          </Text>
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {[
              offer.brand ? `${offer.brand} – ${offer.quantity} ${offer.unit}` : `${offer.quantity} ${offer.unit}`,
              offer.normalizedPrice != null
                ? `${formatCurrency(offer.normalizedPrice)} / ${offer.normalizedUnit}`
                : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>
        <View className="items-end gap-0.5">
          <Text className={cn('text-sm', offer.price != null ? 'font-bold text-foreground' : 'text-muted-foreground')}>
            {offer.price != null ? formatCurrency(offer.price) : noPriceLabel}
          </Text>
        </View>
        <ChevronRight size={18} color={tokens.mutedForeground} />
      </Pressable>
    </Link>
  );
}
