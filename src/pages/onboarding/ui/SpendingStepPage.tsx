import { router } from 'expo-router';

import { SpendingForm } from '@/features/edit-spending';
import { Button, Screen, Text } from '@/shared/ui';

import { useHabit } from '../model/useHabit';

import { t } from '../i18n';

// Шаг после старта: необязательный, назад на старт не ведет. Форма сохраняется сама
export function SpendingStepPage() {
  const habit = useHabit();

  if (!habit) {
    return null;
  }

  return (
    <Screen>
      <Text variant="title">{t('spendingTitle')}</Text>
      <Text>{t('spendingHint')}</Text>
      <SpendingForm habit={habit} />
      <Button
        variant="primary"
        title={t('next')}
        onPress={() => router.replace('/onboarding/reasons')}
      />
    </Screen>
  );
}
