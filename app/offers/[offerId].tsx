import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteButton } from '@/components/domain/delete-button';
import { FeatureScreen } from '@/components/domain/feature-screen';
import { OfferForm, type OfferFormHandle } from '@/components/domain/offer-form';
import { OfferPriceForm, type OfferPriceFormHandle } from '@/components/domain/offer-price-form';
import { PriceHistoryList } from '@/components/domain/price-history-list';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { RatingStars } from '@/components/ui/rating-stars';
import { formatCurrency } from '@/lib/formatting/currency';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useOfferPrices } from '@/lib/hooks/use-offer-prices';
import { useOffer } from '@/lib/hooks/use-product-offers';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';

export default function OfferDetailScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const { item: offer, update, remove } = useOffer(offerId);
  const { items: prices, latest, create } = useOfferPrices(offerId);
  const { items: markets } = useMarkets();
  const market = offer ? markets.find((entry) => entry.id === offer.marketId) : undefined;

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const addFormRef = useRef<OfferPriceFormHandle>(null);
  const editFormRef = useRef<OfferFormHandle>(null);

  const title = offer
    ? `${offer.brand ? `${offer.brand} · ` : ''}${offer.quantity} ${offer.unit}`
    : t('offers.title');
  const imageUri = resolveEntityImageUri(offer?.imagePath) ?? undefined;

  // Quantity/unit live on the offer, so the history list reads them from there.
  const historyRows = prices.map((price) => ({
    id: price.id,
    price: price.price,
    quantity: offer?.quantity ?? 0,
    unit: offer?.unit ?? '',
    observedAt: price.observedAt,
  }));

  return (
    <FeatureScreen title={title} description={market?.name ?? undefined} emoji="🏷️" showBack>
      {offer ? (
        <View className="gap-2">
          {imageUri ? <Image source={{ uri: imageUri }} className="h-44 w-full rounded-2xl" resizeMode="cover" /> : null}
          {offer.rating != null ? <RatingStars value={offer.rating} /> : null}
          {offer.description?.trim() ? (
            <Text className="text-sm text-muted-foreground">{offer.description.trim()}</Text>
          ) : null}
        </View>
      ) : null}
      {latest ? (
        <Text className="text-base text-card-foreground">
          {t('products.latestPrice')}: {formatCurrency(latest.price)} ({formatCurrency(latest.normalizedPrice)}/{latest.normalizedUnit})
        </Text>
      ) : null}
      <Button label={t('offers.addPrice')} variant="secondary" onPress={() => setAddOpen(true)} />
      <Button label={t('actions.edit')} variant="ghost" onPress={() => setEditOpen(true)} />
      <PriceHistoryList prices={historyRows} />
      <DeleteButton onDelete={remove} />

      <BottomSheet visible={addOpen} onClose={() => setAddOpen(false)} bottomInset={insets.bottom}>
        <View className="flex-1 gap-4">
          <FormScreenHeader
            title={t('offers.addPrice')}
            onCancel={() => setAddOpen(false)}
            onSave={() => addFormRef.current?.submit()}
          />
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            <OfferPriceForm
              ref={addFormRef}
              offerId={offerId}
              hideSubmit
              onSubmit={async (values) => {
                await create(values);
                setAddOpen(false);
              }}
            />
          </ScrollView>
        </View>
      </BottomSheet>

      <BottomSheet visible={editOpen} onClose={() => setEditOpen(false)} bottomInset={insets.bottom}>
        <View className="flex-1 gap-4">
          <FormScreenHeader
            title={t('offers.edit')}
            onCancel={() => setEditOpen(false)}
            onSave={() => editFormRef.current?.submit()}
          />
          {offer ? (
            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
              <OfferForm
                ref={editFormRef}
                withPrice={false}
                offerId={offerId}
                initialValues={{
                  marketId: offer.marketId,
                  brand: offer.brand ?? '',
                  quantity: offer.quantity,
                  unit: offer.unit,
                  rating: offer.rating,
                  imagePath: offer.imagePath,
                  description: offer.description ?? '',
                }}
                hideSubmit
                onSubmit={async ({ price: _price, brand, ...rest }) => {
                  await update({ ...rest, brand: brand || null });
                  setEditOpen(false);
                }}
              />
            </ScrollView>
          ) : null}
        </View>
      </BottomSheet>
    </FeatureScreen>
  );
}
