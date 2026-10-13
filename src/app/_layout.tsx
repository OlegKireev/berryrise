import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { t } from '../i18n';

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <ThemeProvider value={scheme === 'light' ? DefaultTheme : DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: t('settings') }} />
        <Stack.Screen name="company" options={{ title: t('company') }} />
        <Stack.Screen name="checkin" options={{ title: t('checkin'), presentation: 'modal' }} />
        <Stack.Screen name="relapse" options={{ title: t('relapse'), presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
