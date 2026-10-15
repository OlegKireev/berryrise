import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { Tabs } from 'expo-router/tabs';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { getHabit } from '@/entities/habit';
import { t } from '@/shared/i18n';
import { Button, Text, fonts, useColors } from '@/shared/ui';

// Подпись таба: у активного полоска сверху и жирнее
function TabLabel({
  focused,
  children,
}: {
  focused: boolean;
  children: string;
}) {
  const colors = useColors();
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <View
        style={{
          width: 32,
          height: 3,
          borderRadius: 2,
          backgroundColor: focused ? colors.text : 'transparent',
        }}
      />
      <Text
        weight={focused ? 'bold' : 'regular'}
        style={{ fontSize: 15, color: focused ? colors.text : colors.muted }}
      >
        {children}
      </Text>
    </View>
  );
}

function SettingsButton() {
  return (
    <Button
      variant="ghost"
      icon="settings"
      accessibilityLabel={t('settings')}
      href="/settings"
    />
  );
}

export default function TabsLayout() {
  const db = useSQLiteContext();
  const colors = useColors();
  // null - еще не знаем. Привычки нет, значит онбординг не пройден
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  useEffect(() => {
    getHabit(db).then((habit) => setOnboarded(habit !== null));
  }, [db]);

  if (onboarded === null) return null;
  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        // крупный заголовок слева, как в макете
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontFamily: fonts.bold,
          fontSize: 28,
        },
        headerRight: SettingsButton,
        tabBarLabel: TabLabel,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.muted,
        // ponytail: табы без иконок, добавим вместе с иконочным пакетом
        tabBarIconStyle: { display: 'none' },
        tabBarItemStyle: { justifyContent: 'flex-start' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('today') }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: t('progress') }}
      />
    </Tabs>
  );
}
