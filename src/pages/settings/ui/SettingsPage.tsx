import { router } from 'expo-router';

import { Row, Screen } from '@/shared/ui';

import { DevResetButton } from './DevResetButton';

import { t } from '../i18n';

// Хаб: новый раздел - новая строка
export function SettingsPage() {
  return (
    <Screen>
      <Row
        label={t('startSpending')}
        onPress={() => router.push('/settings/start')}
      />
      <Row
        label={t('reasons')}
        onPress={() => router.push('/settings/reasons')}
      />
      <Row
        label={t('notifications')}
        onPress={() => router.push('/settings/notifications')}
      />
      <Row
        label={t('about')}
        onPress={() => router.push('/settings/about')}
      />
      {__DEV__ && <DevResetButton />}
    </Screen>
  );
}
