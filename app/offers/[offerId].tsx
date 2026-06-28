import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteButton } from '@/components/domain/delete-button';
import { FeatureScreen } from '@/components/domain/feature-screen';
import { OfferPriceForm, type OfferPriceFormHandle } from '@/components/domain/offer-price-form';
import { PriceHistoryList } from '@/components/domain/price-history-list';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { FormScreenHeader } from '@/components/ui/form-screen-header';
import { formatCurrency } from '@/lib/formatting/currency';
import { useMarkets } from '@/lib/hooks/use-markets';
import { useOfferPrices } from '@/lib/hooks/use-offer-prices';
import { useOffer } from '@/lib/hooks/use-product-offers';
import { useTranslation } from '@/lib/i18n';

export default function OfferDetailScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const { item: offer, remove } = useOffer(offerId);
  const { items: prices, latest, create } = useOfferPrices(offerId);
  const { items: markets } = useMarkets();
  const market = offer ? markets.find((entry) => entry.id === offer.marketId) : undefined;

  const [addOpen, setAddOpen] = useState(false);
  const addFormRef = useRef<OfferPriceFormHandle>(null);

  const title = offer
    ? `${offer.brand ? `${offer.brand} · ` : ''}${offer.quantity} ${offer.unit}`
    : t('offers.title');

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
      {latest ? (
        <Text className="text-base text-card-foreground">
          {t('products.latestPrice')}: {formatCurrency(latest.price)} ({formatCurrency(latest.normalizedPrice)}/{latest.normalizedUnit})
        </Text>
      ) : null}
      <Button label={t('offers.addPrice')} variant="secondary" onPress={() => setAddOpen(true)} />
      <PriceHistoryList prices={historyRows} />
      <DeleteButton onDelete={remove} />

      <BottomSheet visible={addOpen} onClose={() => setAddOpen(false)} bottomInset={insets.bottom}>
        <FormScreenHeader
          title={t('offers.addPrice')}
          onCancel={() => setAddOpen(false)}
          onSave={() => addFormRef.current?.submit()}
        />
        <OfferPriceForm
          ref={addFormRef}
          offerId={offerId}
          hideSubmit
          onSubmit={async (values) => {
            await create(values);
            setAddOpen(false);
          }}
        />
      </BottomSheet>
    </FeatureScreen>
  );
}
