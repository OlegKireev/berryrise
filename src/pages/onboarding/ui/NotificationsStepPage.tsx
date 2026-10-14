import { Button } from 'react-native';

import { NotificationForm } from '@/features/notifications';
import { Screen, Text } from '@/shared/ui';

import { useNotificationsStep } from '../model/useNotificationsStep';

import { t } from '../i18n';

export function NotificationsStepPage() {
  const step = useNotificationsStep();

  return (
    <Screen>
      <Text variant="title">{t('notificationsTitle')}</Text>
      <Text>{t('notificationsHint')}</Text>
      <NotificationForm
        value={step.prefs}
        onChange={step.setPrefs}
      />
      <Button
        title={t('next')}
        disabled={step.saving}
        onPress={step.submit}
      />
      <Button
        title={t('skip')}
        disabled={step.saving}
        onPress={step.skip}
      />
    </Screen>
  );
}
