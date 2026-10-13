import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { migrate } from '@/shared/db';
import { t } from '@/shared/i18n';

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <SQLiteProvider
      databaseName="resheno.db"
      onInit={migrate}
    >
      <ThemeProvider value={scheme === 'light' ? DefaultTheme : DarkTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="onboarding"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="settings"
            options={{ title: t('settings') }}
          />
          <Stack.Screen
            name="company"
            options={{ title: t('company') }}
          />
          <Stack.Screen
            name="check-in"
            options={{ title: t('checkin'), presentation: 'modal' }}
          />
          <Stack.Screen
            name="relapse"
            options={{ title: t('relapse'), presentation: 'modal' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
