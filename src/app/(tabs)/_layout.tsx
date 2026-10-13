import { Link, useTheme } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import { Text } from 'react-native';

import { t } from '../../i18n';

function SettingsButton() {
  const { colors } = useTheme();
  return (
    <Link
      href="/settings"
      accessibilityLabel={t('settings')}
      style={{ padding: 16 }}
    >
      <Text style={{ color: colors.text, fontSize: 22 }}>⚙︎</Text>
    </Link>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerRight: SettingsButton,
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
      <Tabs.Screen
        name="reasons"
        options={{ title: t('reasons') }}
      />
    </Tabs>
  );
}
