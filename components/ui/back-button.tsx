import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getDesignTokens } from '@/lib/theme/tokens';

// SVG icon (not a text glyph) so it stays optically centered in the circle.
export function BackButton() {
  const router = useRouter();
  const { foreground } = getDesignTokens(useColorScheme());

  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={8}
      className="size-10 items-center justify-center rounded-full bg-muted active:opacity-70">
      <ArrowLeft size={20} color={foreground} strokeWidth={2.5} />
    </Pressable>
  );
}
