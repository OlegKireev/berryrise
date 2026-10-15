import { Link, Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { getHabit } from '@/entities/habit';
import { t } from '@/shared/i18n';
import { Text, useColors, useScreenColors } from '@/shared/ui';

function SettingsButton() {
  const colors = useColors();
  return (
    <Link
      href="/settings"
      accessibilityLabel={t('settings')}
      style={{ padding: 16 }}
    >
      <Text style={{ color: colors.muted, fontSize: 22 }}>⚙︎</Text>
    </Link>
  );
}

export default function TabsLayout() {
  const db = useSQLiteContext();
  const colors = useColors();
  const screenColors = useScreenColors();
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
        ...screenColors,
        headerRight: SettingsButton,
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
        tabBarItemStyle: {
          justifyContent: 'center',
        },
        tabBarLabelStyle: { fontSize: 15 },
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
