import { NotificationForm } from '@/features/notifications';
import { Button, Screen, Text } from '@/shared/ui';

import { useNotificationsStep } from '../model/useNotificationsStep';

import { t } from '../i18n';

export function NotificationsStepPage() {
  const step = useNotificationsStep();

  return (
    <Screen
      footer={
        <>
          <Button
            variant="primary"
            title={t('next')}
            disabled={step.saving}
            onPress={step.submit}
          />
          <Button
            variant="quiet"
            title={t('skip')}
            disabled={step.saving}
            onPress={step.skip}
          />
        </>
      }
    >
      <Text variant="title">{t('notificationsTitle')}</Text>
      <Text>{t('notificationsHint')}</Text>
      <NotificationForm
        value={step.prefs}
        onChange={step.setPrefs}
      />
    </Screen>
  );
}
