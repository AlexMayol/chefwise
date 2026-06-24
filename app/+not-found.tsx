import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useTranslation } from '@/lib/i18n';
import { designTokens } from '@/lib/theme/tokens';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('errors.deleteBlocked') }} />
      <View style={styles.container}>
        <Text style={styles.title}>{t('common.empty')}</Text>

        <Link href="/(tabs)/products" style={styles.link}>
          <Text lightColor={designTokens.light.primary} darkColor={designTokens.dark.primary} style={styles.linkText}>{t('navigation.products')}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
  },
});
