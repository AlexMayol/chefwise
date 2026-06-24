import * as ImagePicker from 'expo-image-picker';
import { Image, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { saveEntityImage, deleteEntityImage, resolveEntityImageUri } from '@/lib/images/storage';
import { useTranslation } from '@/lib/i18n';

type EntityImageFieldProps = {
  entityType: 'product' | 'recipe' | 'market';
  entityId: string;
  value?: string | null;
  onChange(path: string | null): void;
};

export function EntityImageField({ entityType, entityId, value, onChange }: EntityImageFieldProps) {
  const { t } = useTranslation();
  const uri = resolveEntityImageUri(value);

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

  async function removeImage() {
    await deleteEntityImage(value);
    onChange(null);
  }

  return (
    <View className="gap-2 rounded-2xl border border-dashed border-border p-4">
      {uri ? <Image source={{ uri }} className="h-40 w-full rounded-xl" resizeMode="cover" /> : <Text className="text-sm text-muted-foreground">{t('common.empty')}</Text>}
      <Button label={t('actions.addImage')} variant="ghost" onPress={() => void pickImage()} />
      {uri ? <Button label={t('actions.delete')} variant="destructive" onPress={() => void removeImage()} /> : null}
    </View>
  );
}
