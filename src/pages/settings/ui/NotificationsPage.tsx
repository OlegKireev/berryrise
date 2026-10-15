import { Linking } from 'react-native';

import {
  AutostartHint,
  NotificationForm,
  needsAutostartHint,
} from '@/features/notifications';
import { Button, Screen, Text } from '@/shared/ui';

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
        <>
          <Text>{t('notificationsDenied')}</Text>
          <Button
            title={t('openSystemSettings')}
            onPress={() => Linking.openSettings()}
          />
        </>
      )}
      <NotificationForm
        value={settings.prefs}
        onChange={settings.change}
      />
      {needsAutostartHint && <AutostartHint />}
    </Screen>
  );
}
