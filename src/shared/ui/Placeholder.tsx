import { useTheme } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { t } from '@/shared/i18n';

// ponytail: общая заглушка экрана, пока у экранов нет своего содержимого
export function Placeholder({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={{ color: colors.text, opacity: 0.6 }}>{t('soon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  title: { fontSize: 24, fontWeight: '600' },
});
