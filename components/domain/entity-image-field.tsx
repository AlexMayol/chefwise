import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, Text, View } from 'react-native';

import { IconButton } from '@/components/ui/icon-button';
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

  async function handleResult(result: ImagePicker.ImagePickerResult) {
    if (!result.canceled && result.assets[0]?.uri) {
      onChange(await saveEntityImage(entityType, entityId, result.assets[0].uri));
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    await handleResult(await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.85 }));
  }

  async function pickFromLibrary() {
    await handleResult(
      await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.85 }),
    );
  }

  // ponytail: native Alert action sheet, not a custom modal
  function chooseSource() {
    Alert.alert(t('actions.addImage'), undefined, [
      { text: t('actions.takePhoto'), onPress: () => void takePhoto() },
      { text: t('actions.chooseFromLibrary'), onPress: () => void pickFromLibrary() },
      { text: t('actions.cancel'), style: 'cancel' },
    ]);
  }

  async function removeImage() {
    await deleteEntityImage(value);
    onChange(null);
  }

  if (uri) {
    return (
      <View className="relative">
        <Image source={{ uri }} className="h-44 w-full rounded-2xl" resizeMode="cover" />
        <IconButton
          onPress={() => void removeImage()}
          size="sm"
          variant="overlay"
          accessibilityLabel={t('actions.delete')}
          className="absolute right-2 top-2">
          <Text className="text-base font-semibold text-foreground">✕</Text>
        </IconButton>
      </View>
    );
  }

  return (
    <Pressable
      onPress={chooseSource}
      className="h-44 w-full items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-muted/30 active:opacity-70">
      <Text className="text-2xl text-muted-foreground">＋</Text>
      <Text className="text-sm font-medium text-muted-foreground">{t('actions.addImage')}</Text>
    </Pressable>
  );
}
