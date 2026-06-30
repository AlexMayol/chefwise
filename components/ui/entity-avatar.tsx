import { Image, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

// Row thumbnails in product/market offer lists (products tab, category detail, product detail offers).
export const LIST_THUMB_SIZE = 52;

type EntityAvatarProps = {
  imageUri?: string;
  emoji?: string;
  size?: number;
  // Round (markets/category hero) vs. rounded-square (product/list tiles).
  circle?: boolean;
  // Override the fallback background (e.g. bg-card for a logo on white).
  className?: string;
};

// Shared product/category/market thumbnail: a real image, or an emoji on a tinted tile.
export function EntityAvatar({ imageUri, emoji, size = LIST_THUMB_SIZE, circle = false, className }: EntityAvatarProps) {
  const borderRadius = circle ? size / 2 : Math.round(size * 0.28);

  if (imageUri) {
    return (
      <Image source={{ uri: imageUri }} style={{ width: size, height: size, borderRadius }} resizeMode="cover" />
    );
  }

  return (
    <View style={{ width: size, height: size, borderRadius }} className={cn('items-center justify-center bg-muted', className)}>
      <Text style={{ fontSize: Math.round(size * 0.5) }}>{emoji ?? '🛒'}</Text>
    </View>
  );
}
