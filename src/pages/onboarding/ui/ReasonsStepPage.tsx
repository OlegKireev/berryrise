import { router } from 'expo-router';

import { ReasonPicker, useReasonPicker } from '@/features/edit-reasons';
import { Button, Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

// Шаг после старта: привычка уже есть, поэтому шаг необязательный.
// Выбор сохраняется сразу, "Дальше" только переходит, "Пропустить" снимает выбор
export function ReasonsStepPage() {
  const picker = useReasonPicker();

  if (!picker) {
    return null;
  }

  return (
    <Screen
      footer={
        <>
          <Button
            variant="primary"
            title={t('next')}
            href="/onboarding/notifications"
          />
          <Button
            variant="quiet"
            title={t('skip')}
            onPress={() => {
              picker.clear();
              router.push('/onboarding/notifications');
            }}
          />
        </>
      }
    >
      <Text variant="title">{t('reasonsStepTitle')}</Text>
      <Text>{t('reasonsStepHint')}</Text>
      <ReasonPicker picker={picker} />
    </Screen>
  );
}
