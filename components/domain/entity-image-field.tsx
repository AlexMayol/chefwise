import * as ImagePicker from 'expo-image-picker';
import { Image, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { saveEntityImage, resolveImageUri } from '@/lib/images/storage';
import { useTranslation } from '@/lib/i18n';

type EntityImageFieldProps = {
  entityType: 'product' | 'recipe';
  entityId: string;
  value?: string | null;
  onChange(path: string): void;
};

export function EntityImageField({ entityType, entityId, value, onChange }: EntityImageFieldProps) {
  const { t } = useTranslation();
  const uri = resolveImageUri(value);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      onChange(await saveEntityImage(entityType, entityId, result.assets[0].uri));
    }
  }

  return (
    <View className="gap-2 rounded-2xl border border-dashed border-border p-4">
      {uri ? <Image source={{ uri }} className="h-40 rounded-xl" resizeMode="cover" /> : <Text className="text-sm text-muted-foreground">{t('common.empty')}</Text>}
      <Button label={t('actions.add')} variant="ghost" onPress={() => void pickImage()} />
    </View>
  );
}
