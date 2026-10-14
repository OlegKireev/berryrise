import { router } from 'expo-router';

import { reasons } from '@/entities/reason';
import { Button, Choices, Input, Screen, Text } from '@/shared/ui';

import { useReasonsStep } from '../model/useReasonsStep';

import { t } from '../i18n';

// Шаг после старта: привычка уже есть, поэтому шаг необязательный и назад не ведет
export function ReasonsStepPage() {
  const form = useReasonsStep();

  return (
    <Screen>
      <Text variant="title">{t('reasonsStepTitle')}</Text>
      <Text>{t('reasonsStepHint')}</Text>
      <Choices
        keys={reasons}
        label={(k) => t(`reason.labels.${k}`)}
        isSelected={(k) => form.keys.includes(k)}
        onPress={form.toggleKey}
      />
      <Input
        value={form.custom}
        onChangeText={form.setCustom}
        placeholder={t('reason.customReason')}
      />
      <Button
        variant="primary"
        title={t('next')}
        disabled={!form.canSubmit}
        onPress={form.submit}
      />
      <Button
        variant="quiet"
        title={t('skip')}
        disabled={form.saving}
        onPress={() => router.replace('/onboarding/notifications')}
      />
    </Screen>
  );
}
