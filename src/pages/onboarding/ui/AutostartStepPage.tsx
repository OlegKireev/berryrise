import { router } from 'expo-router';
import { Button } from 'react-native';

import { AutostartHint } from '@/features/notifications';
import { Screen } from '@/shared/ui';

import { t } from '../i18n';

// Только на Xiaomi и подобных, туда ведет шаг уведомлений
export function AutostartStepPage() {
  return (
    <Screen>
      <AutostartHint />
      <Button
        title={t('done')}
        onPress={() => router.replace('/')}
      />
    </Screen>
  );
}
