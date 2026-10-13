import { Link, useTheme, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { t } from '../i18n';

type Props = { title: string; links?: { href: Href; label: string }[] };

// ponytail: общая заглушка экрана, пока у экранов нет своего содержимого
export function Placeholder({ title, links = [] }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={{ color: colors.text, opacity: 0.6 }}>{t('soon')}</Text>
      {links.map((l) => (
        <Link key={l.label} href={l.href} style={[styles.link, { color: colors.primary }]}>
          {l.label}
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 },
  title: { fontSize: 24, fontWeight: '600' },
  link: { fontSize: 18, padding: 8 },
});
