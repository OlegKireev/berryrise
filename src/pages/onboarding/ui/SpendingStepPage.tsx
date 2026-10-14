import { router } from 'expo-router';
import { Button } from 'react-native';

import { SpendingForm } from '@/features/edit-spending';
import { Screen, Text } from '@/shared/ui';

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
      <Text style={{ fontSize: 24, fontWeight: '600' }}>
        {t('spendingTitle')}
      </Text>
      <Text>{t('spendingHint')}</Text>
      <SpendingForm
        habit={habit}
        submitLabel={t('next')}
        onSaved={next}
      />
      <Button
        title={t('skip')}
        onPress={next}
      />
    </Screen>
  );
}
