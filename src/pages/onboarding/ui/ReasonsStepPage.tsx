import { router } from 'expo-router';

import { ReasonPicker, useReasonPicker } from '@/features/edit-reasons';
import { Button, Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

// Шаг после старта: привычка уже есть, поэтому шаг необязательный и назад не ведет.
// Выбор сохраняется сразу, "Дальше" только переходит
export function ReasonsStepPage() {
  const picker = useReasonPicker();

  if (!picker) {
    return null;
  }

  return (
    <Screen
      footer={
        <Button
          variant="primary"
          title={t('next')}
          onPress={() => router.replace('/onboarding/notifications')}
        />
      }
    >
      <Text variant="title">{t('reasonsStepTitle')}</Text>
      <Text>{t('reasonsStepHint')}</Text>
      <ReasonPicker picker={picker} />
    </Screen>
  );
}
