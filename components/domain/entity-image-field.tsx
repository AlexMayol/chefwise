import * as ImagePicker from 'expo-image-picker';
import { Image, Pressable, Text, View } from 'react-native';

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

  if (uri) {
    return (
      <View className="relative">
        <Image source={{ uri }} className="h-44 w-full rounded-2xl" resizeMode="cover" />
        <Pressable
          onPress={() => void removeImage()}
          hitSlop={8}
          accessibilityLabel={t('actions.delete')}
          className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-background/80 active:opacity-70">
          <Text className="text-base font-semibold text-foreground">✕</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => void pickImage()}
      className="h-44 w-full items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-muted/30 active:opacity-70">
      <Text className="text-2xl text-muted-foreground">＋</Text>
      <Text className="text-sm font-medium text-muted-foreground">{t('actions.addImage')}</Text>
    </Pressable>
  );
}
