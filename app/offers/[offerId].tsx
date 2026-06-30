import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteButton } from '@/components/domain/delete-button';
import { FeatureScreen } from '@/components/domain/feature-screen';
import { OfferForm, type OfferFormHandle } from '@/components/domain/offer-form';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { RatingStars } from '@/components/ui/rating-stars';
import { formatCurrency } from '@/lib/formatting/currency';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useOffer } from '@/lib/hooks/use-product-offers';
import { useTranslation } from '@/lib/i18n';
import { resolveEntityImageUri } from '@/lib/images/storage';

export default function OfferDetailScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const { item: offer, update, remove } = useOffer(offerId);
  const { items: markets } = useMarkets();
  const market = offer ? markets.find((entry) => entry.id === offer.marketId) : undefined;

  const [editOpen, setEditOpen] = useState(false);
  const editFormRef = useRef<OfferFormHandle>(null);

  const title = offer
    ? `${offer.brand ? `${offer.brand} · ` : ''}${offer.quantity} ${offer.unit}`
    : t('offers.title');
  const imageUri = resolveEntityImageUri(offer?.imagePath) ?? undefined;

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
      {offer?.price != null ? (
        <Text className="text-base text-card-foreground">
          {t('forms.price')}: {formatCurrency(offer.price)}
          {offer.normalizedPrice != null ? ` (${formatCurrency(offer.normalizedPrice)}/${offer.normalizedUnit})` : ''}
        </Text>
      ) : null}
      <Button label={t('offers.edit')} variant="secondary" onPress={() => setEditOpen(true)} />
      <DeleteButton onDelete={remove} />

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
                offerId={offerId}
                initialValues={{
                  marketId: offer.marketId,
                  brand: offer.brand ?? '',
                  quantity: offer.quantity,
                  unit: offer.unit,
                  rating: offer.rating,
                  imagePath: offer.imagePath,
                  description: offer.description ?? '',
                  price: offer.price ?? undefined,
                }}
                hideSubmit
                onSubmit={async ({ brand, price, ...rest }) => {
                  await update({ ...rest, brand: brand || null, price });
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
