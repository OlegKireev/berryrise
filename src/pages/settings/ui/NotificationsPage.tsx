import { Linking } from 'react-native';

import { AutostartHint, NotificationForm } from '@/features/notifications';
import { Button, Notice, Screen, Text } from '@/shared/ui';

import { useNotificationSettings } from '../model/useNotificationSettings';

import { t } from '../i18n';

export function NotificationsPage() {
  const settings = useNotificationSettings();

  if (!settings) {
    return null;
  }

  return (
    <Screen>
      {settings.denied && (
        <Notice icon="bellOff">
          <Text>{t('notificationsDenied')}</Text>
          <Button
            title={t('openSystemSettings')}
            onPress={() => Linking.openSettings()}
          />
        </Notice>
      )}
      <NotificationForm
        value={settings.prefs}
        onChange={settings.change}
      />
      {settings.autostartHint && <AutostartHint />}
    </Screen>
  );
}
