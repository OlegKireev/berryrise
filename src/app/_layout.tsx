import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useNotifications } from '@/features/notifications';
import { migrate } from '@/shared/db';
import { t } from '@/shared/i18n';
import { headerOptions, navigationTheme } from '@/shared/ui';

// Сплэш держится, пока не загрузился шрифт, иначе между ним и первым экраном пустой кадр
SplashScreen.preventAutoHideAsync();

// Хуку нужна база, поэтому он внутри SQLiteProvider
function Notifications() {
  useNotifications();
  return null;
}

export default function RootLayout() {
  // ponytail: шрифт грузится в рантайме под сплэшем, без пересборки; если старт заметно тормозит - вшить плагином expo-font
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  // без шрифта лучше открыться системным, чем навсегда остаться на сплэше
  const ready = fontsLoaded || fontError;

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  if (!ready) return null;

  return (
    <SQLiteProvider
      databaseName="resheno.db"
      onInit={migrate}
    >
      <Notifications />
      <Navigation />
    </SQLiteProvider>
  );
}

// Тема берется здесь, а не в RootLayout: SQLiteProvider - memo, который
// не сравнивает children, и без своего хука навигация не видит смену темы
function Navigation() {
  const scheme = useColorScheme();
  const theme = navigationTheme(scheme);

  // фон окна под экранами, чтобы при переходах не мелькал белый или черный
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={headerOptions}>
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
          name="achievements"
          options={{ title: t('achievementsTitle') }}
        />
        <Stack.Screen
          name="achievement/[key]"
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="company"
          options={{ title: t('company') }}
        />
        <Stack.Screen
          name="day/[date]"
          options={{ title: t('day'), presentation: 'modal' }}
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
  );
}
