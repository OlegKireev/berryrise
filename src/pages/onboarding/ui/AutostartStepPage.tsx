import { router } from 'expo-router';

import { AutostartHint } from '@/features/notifications';
import { Button, Screen } from '@/shared/ui';

import { t } from '../i18n';

// Только на Xiaomi и подобных, туда ведет шаг уведомлений
export function AutostartStepPage() {
  return (
    <Screen
      footer={
        <Button
          variant="primary"
          title={t('done')}
          onPress={() => router.replace('/')}
        />
      }
    >
      <AutostartHint />
    </Screen>
  );
}
