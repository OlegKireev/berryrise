import { router } from 'expo-router';

import { SpendingForm } from '@/features/edit-spending';
import { Button, Screen, Text } from '@/shared/ui';

import { useHabit } from '../model/useHabit';

import { t } from '../i18n';

const next = () => router.replace('/onboarding/reasons');

// Шаг после старта: необязательный, назад на старт не ведет
export function SpendingStepPage() {
  const habit = useHabit();

  if (!habit) {
    return null;
  }

  return (
    <Screen>
      <Text variant="title">{t('spendingTitle')}</Text>
      <Text>{t('spendingHint')}</Text>
      <SpendingForm
        habit={habit}
        submitLabel={t('next')}
        onSaved={next}
      />
      <Button
        variant="quiet"
        title={t('skip')}
        onPress={next}
      />
    </Screen>
  );
}
