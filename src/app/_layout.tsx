import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { Stack, ThemeProvider } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useNotifications } from '@/features/notifications';
import { migrate } from '@/shared/db';
import { t } from '@/shared/i18n';
import { navigationTheme, useScreenColors } from '@/shared/ui';

// Хуку нужна база, поэтому он внутри SQLiteProvider
function Notifications() {
  useNotifications();
  return null;
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = navigationTheme(scheme);
  const screenColors = useScreenColors();
  // ponytail: шрифт грузится в рантайме, без пересборки; если первый кадр мигает - вшить плагином expo-font
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // фон окна под экранами, чтобы при переходах не мелькал белый или черный
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  if (!fontsLoaded) return null;

  return (
    <SQLiteProvider
      databaseName="resheno.db"
      onInit={migrate}
    >
      <Notifications />
      <ThemeProvider value={theme}>
        <Stack screenOptions={screenColors}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="onboarding"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="settings/index"
            options={{ title: t('settings') }}
          />
          <Stack.Screen
            name="settings/start"
            options={{ title: t('startSpending') }}
          />
          <Stack.Screen
            name="settings/reasons"
            options={{ title: t('reasons') }}
          />
          <Stack.Screen
            name="settings/notifications"
            options={{ title: t('notifications') }}
          />
          <Stack.Screen
            name="settings/about"
            options={{ title: t('about') }}
          />
          <Stack.Screen
            name="company"
            options={{ title: t('company') }}
          />
          <Stack.Screen
            name="day-review"
            options={{ title: t('dayReview'), presentation: 'modal' }}
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
