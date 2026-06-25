import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { IconButton } from '@/components/ui/icon-button';
import { useColorScheme } from '@/components/useColorScheme';
import { getDesignTokens } from '@/lib/theme/tokens';

// SVG icon (not a text glyph) so it stays optically centered in the circle.
export function BackButton() {
  const router = useRouter();
  const { foreground } = getDesignTokens(useColorScheme());

  return (
    <IconButton onPress={() => router.back()}>
      <ArrowLeft size={20} color={foreground} strokeWidth={2.5} />
    </IconButton>
  );
}
