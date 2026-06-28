import { Link, useLocalSearchParams, type Href } from 'expo-router';
import { ChevronRight, MoreVertical, Plus, Star } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteButton } from '@/components/domain/delete-button';
import { OfferForm, type OfferFormHandle } from '@/components/domain/offer-form';
import { ProductForm, type ProductFormHandle } from '@/components/domain/product-form';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Card } from '@/components/ui/card';
import { DetailHeader } from '@/components/ui/detail-header';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { EmptyState } from '@/components/ui/empty-state';
import { EntityAvatar } from '@/components/ui/entity-avatar';
import { IconButton } from '@/components/ui/icon-button';
import { ListRow } from '@/components/ui/list-row';
import { LoadingState } from '@/components/ui/loading-state';
import { RatingStars } from '@/components/ui/rating-stars';
import { ScreenScaffold } from '@/components/ui/screen-scaffold';
import { SegmentedTabs } from '@/components/ui/segmented-tabs';

import type { ProductOfferListItem } from '@/lib/db/repositories/product-offers';
import { formatCurrency } from '@/lib/formatting/currency';
import { formatDate } from '@/lib/formatting/date';
import { useCategories } from '@/lib/hooks/use-categories';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useProductOffers } from '@/lib/hooks/use-product-offers';
import { useProductDetail } from '@/lib/hooks/use-products';
import { useReloadOnFocus } from '@/lib/hooks/use-reload-on-focus';
import { useTranslation } from '@/lib/i18n';
import { pickBestOfferImagePath } from '@/lib/domain/products';
import { resolveEntityImageUri } from '@/lib/images/storage';
import type { DesignTokens } from '@/lib/theme/tokens';
import { productEmoji } from '@/lib/ui/category-emoji';
import { cn } from '@/lib/utils';
type DetailTab = 'overview' | 'prices' | 'history';

type OfferGroup = {
  marketId: string;
  marketName: string;
  logoUri?: string;
  offers: ProductOfferListItem[];
};

export default function ProductDetailScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tokens = useDesignTokens();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { item: product, update, remove } = useProductDetail(productId);
  const { items: offers, createWithPrice, reload } = useProductOffers(productId);
  const { items: markets } = useMarkets();
  const { items: categories } = useCategories();

  const [tab, setTab] = useState<DetailTab>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const editFormRef = useRef<ProductFormHandle>(null);
  const addFormRef = useRef<OfferFormHandle>(null);

  // Offers/prices change on the offer screen; refresh when this screen regains focus.
  useReloadOnFocus(reload);

  const categoryName = product?.categoryId
    ? categories.find((category) => category.id === product.categoryId)?.name ?? null
    : null;

  const offerGroups = useMemo<OfferGroup[]>(() => {
    const logos = new Map(markets.map((market) => [market.id, resolveEntityImageUri(market.imagePath) ?? undefined]));
    const groups = new Map<string, OfferGroup>();
    for (const offer of offers) {
      if (!groups.has(offer.marketId)) {
        groups.set(offer.marketId, {
          marketId: offer.marketId,
          marketName: offer.marketName ?? '',
          logoUri: logos.get(offer.marketId),
          offers: [],
        });
      }
      groups.get(offer.marketId)!.offers.push(offer);
    }
    return [...groups.values()];
  }, [offers, markets]);

  const historyOffers = useMemo(
    () =>
      [...offers].sort((a, b) => {
        if (!a.observedAt) return 1;
        if (!b.observedAt) return -1;
        return b.observedAt.localeCompare(a.observedAt);
      }),
    [offers],
  );

  const bestPrice = useMemo(() => {
    const values = offers.map((offer) => offer.normalizedPrice).filter((value): value is number => value != null);
    return values.length ? Math.min(...values) : null;
  }, [offers]);

  const avatarImageUri = useMemo(
    () => resolveEntityImageUri(pickBestOfferImagePath(offers)) ?? undefined,
    [offers],
  );

  if (!product) {
    return (
      <ScreenScaffold>
        <DetailHeader />
        <LoadingState />
      </ScreenScaffold>
    );
  }

  const emoji = productEmoji(product.categoryId, categories);

  const tabs: { key: DetailTab; label: string }[] = [
    { key: 'overview', label: t('products.tabOverview') },
    { key: 'prices', label: t('products.tabPrices') },
    { key: 'history', label: t('products.tabHistory') },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScreenScaffold>
        <DetailHeader>
          <IconButton accessibilityLabel={t('forms.favorite')} onPress={() => void update({ isFavorite: !product.isFavorite })}>
            <Star
              size={20}
              color={product.isFavorite ? tokens.rating : tokens.mutedForeground}
              fill={product.isFavorite ? tokens.rating : 'transparent'}
            />
          </IconButton>
          <IconButton accessibilityLabel={t('actions.more')} onPress={() => setMenuOpen(true)}>
            <MoreVertical size={20} color={tokens.foreground} />
          </IconButton>
        </DetailHeader>

        <View className="flex-row items-start gap-4">
          <View className="relative size-[72px] shrink-0">
            <EntityAvatar imageUri={avatarImageUri} emoji={emoji} size={72} circle />
            {product.isFavorite ? (
              <Animated.View
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(250)}
                className="absolute -bottom-1 -right-1 flex-row items-center gap-1 rounded-full border border-primary bg-background px-2 py-0.5">
                <Star size={12} color={tokens.primary} fill={tokens.primary} />
                <Text className="text-xs font-semibold text-primary">{t('forms.favorite')}</Text>
              </Animated.View>
            ) : null}
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-2xl font-bold tracking-tight text-foreground">{product.name}</Text>
            {categoryName ? <Text className="text-base text-muted-foreground">{categoryName}</Text> : null}
          </View>
        </View>

        <SegmentedTabs<DetailTab> tabs={tabs} value={tab} onChange={setTab} />

        {tab === 'overview' ? (
          <View className="gap-4">
            {bestPrice != null ? (
              <Text className="text-sm text-muted-foreground">
                {t('common.fromPrice', { price: formatCurrency(bestPrice) })} · {t('offers.marketCount', { count: offerGroups.length })}
              </Text>
            ) : null}
            <Text className="text-base font-bold text-card-foreground">{t('products.priceByMarket')}</Text>
            <PriceByMarket
              groups={offerGroups}
              emoji={emoji}
              tokens={tokens}
              noPriceLabel={t('common.noPriceYet')}
              emptyLabel={t('offers.none')}
            />
          </View>
        ) : null}

        {tab === 'prices' ? (
          <PriceByMarket
            groups={offerGroups}
            emoji={emoji}
            tokens={tokens}
            noPriceLabel={t('common.noPriceYet')}
            emptyLabel={t('offers.none')}
          />
        ) : null}

        {tab === 'history' ? (
          historyOffers.length > 0 ? (
            <View className="gap-2">
              {historyOffers.map((offer) => (
                <Link key={offer.id} href={`/offers/${offer.id}` as Href} asChild>
                  <ListRow
                    title={offer.brand ? `${offer.marketName ?? ''} · ${offer.brand}` : offer.marketName ?? ''}
                    subtitle={offer.observedAt ? formatDate(offer.observedAt) : undefined}
                    meta={offer.price != null ? formatCurrency(offer.price) : t('common.noPriceYet')}
                    chevron
                  />
                </Link>
              ))}
            </View>
          ) : (
            <EmptyState title={t('offers.none')} />
          )
        ) : null}
      </ScreenScaffold>

      <BottomActionBar withSafeArea>
        <Pressable
          className="flex-row items-center justify-center gap-2 rounded-xl border border-primary bg-card py-3.5 active:opacity-80"
          onPress={() => setAddOpen(true)}>
          <Plus size={18} color={tokens.primary} />
          <Text className="font-semibold text-primary">{t('products.addPrice')}</Text>
        </Pressable>
      </BottomActionBar>

      <BottomSheet visible={addOpen} onClose={() => setAddOpen(false)} bottomInset={insets.bottom}>
        <View className="flex-1 gap-4">
          <FormScreenHeader
            title={t('products.addPrice')}
            onCancel={() => setAddOpen(false)}
            onSave={() => addFormRef.current?.submit()}
          />
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            <OfferForm
              ref={addFormRef}
              defaultUnit={product.defaultUnit}
              hideSubmit
              onSubmit={async ({ marketId, brand, quantity, unit, rating, imagePath, description, price }) => {
                await createWithPrice(
                  { productId, marketId, brand: brand || null, quantity, unit, rating, imagePath, description },
                  price as number,
                );
                setAddOpen(false);
              }}
            />
          </ScrollView>
        </View>
      </BottomSheet>

      <BottomSheet visible={editOpen} onClose={() => setEditOpen(false)} bottomInset={insets.bottom}>
        <View className="flex-1 gap-4">
          <FormScreenHeader
            title={t('products.edit')}
            onCancel={() => setEditOpen(false)}
            onSave={() => editFormRef.current?.submit()}
          />
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            <ProductForm
              ref={editFormRef}
              initialValues={product}
              hideSubmit
              onSubmit={async (values) => {
                await update(values);
                setEditOpen(false);
              }}
            />
          </ScrollView>
        </View>
      </BottomSheet>

      <BottomSheet visible={menuOpen} onClose={() => setMenuOpen(false)} bottomInset={insets.bottom} resizable={false}>
        <View className="gap-3">
          <Pressable
            className="rounded-xl px-4 py-3 active:opacity-70"
            onPress={() => {
              setMenuOpen(false);
              setEditOpen(true);
            }}>
            <Text className="text-base font-semibold text-foreground">{t('actions.edit')}</Text>
          </Pressable>
          <DeleteButton onDelete={remove} />
        </View>
      </BottomSheet>
    </View>
  );
}

function PriceByMarket({
  groups,
  emoji,
  tokens,
  noPriceLabel,
  emptyLabel,
}: {
  groups: OfferGroup[];
  emoji: string;
  tokens: DesignTokens;
  noPriceLabel: string;
  emptyLabel: string;
}) {
  if (groups.length === 0) {
    return <EmptyState title={emptyLabel} />;
  }

  return (
    <View className="gap-3">
      {groups.map((group) => (
        <Card key={group.marketId} className="gap-0 overflow-hidden p-0">
          <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
            {group.logoUri ? (
              <Image source={{ uri: group.logoUri }} className="size-6 rounded-md" resizeMode="cover" />
            ) : null}
            <Text className="text-base font-bold text-card-foreground">{group.marketName}</Text>
          </View>
          {group.offers.map((offer, index) => (
            <Link key={offer.id} href={`/offers/${offer.id}` as Href} asChild>
              <Pressable
                className={cn(
                  'flex-row items-center gap-3 px-4 py-3 active:opacity-70',
                  index > 0 && 'border-t border-border',
                )}>
                {/* Image, rating and description now live on the offer, so they render per row. */}
                <EntityAvatar imageUri={resolveEntityImageUri(offer.imagePath) ?? undefined} emoji={emoji} size={44} />
                <View className="flex-1 gap-0.5">
                  <Text className="text-sm font-medium text-card-foreground" numberOfLines={1}>
                    {offer.brand ? `${offer.brand} – ` : ''}
                    {offer.quantity} {offer.unit}
                  </Text>
                  {offer.rating != null ? <RatingStars value={offer.rating} /> : null}
                  {offer.description?.trim() ? (
                    <Text className="text-xs text-muted-foreground" numberOfLines={2}>
                      {offer.description.trim()}
                    </Text>
                  ) : null}
                </View>
                <View className="items-end">
                  <Text className="text-sm font-bold text-foreground">
                    {offer.price != null ? formatCurrency(offer.price) : noPriceLabel}
                  </Text>
                  {offer.normalizedPrice != null ? (
                    <Text className="text-xs text-muted-foreground">
                      {formatCurrency(offer.normalizedPrice)} / {offer.normalizedUnit}
                    </Text>
                  ) : null}
                </View>
                <ChevronRight size={18} color={tokens.mutedForeground} />
              </Pressable>
            </Link>
          ))}
        </Card>
      ))}
    </View>
  );
}
