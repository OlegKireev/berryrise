import { Linking } from 'react-native';

import {
  AutostartHint,
  DevNotificationDebug,
  NotificationForm,
  needsAutostartHint,
} from '@/features/notifications';
import { Button, Text } from '@/shared/ui';

import { useNotificationSettings } from '../model/useNotificationSettings';

import { t } from '../i18n';

export function NotificationsSection() {
  const settings = useNotificationSettings();

  if (!settings) {
    return null;
  }

  return (
    <>
      <Text variant="heading">{t('notifications')}</Text>
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
      {__DEV__ && <DevNotificationDebug />}
    </>
  );
}
