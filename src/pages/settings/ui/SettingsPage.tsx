import { Row, Screen } from '@/shared/ui';

import { DevResetButton } from './DevResetButton';

import { t } from '../i18n';

// Хаб: новый раздел - новая строка
export function SettingsPage() {
  return (
    <Screen>
      <Row
        icon="wallet"
        label={t('startSpending')}
        href="/settings/start"
      />
      <Row
        icon="heart"
        label={t('reasons')}
        href="/settings/reasons"
      />
      <Row
        icon="bell"
        label={t('notifications')}
        href="/settings/notifications"
      />
      <Row
        icon="info"
        label={t('about')}
        href="/settings/about"
      />
      {__DEV__ && <DevResetButton />}
    </Screen>
  );
}
