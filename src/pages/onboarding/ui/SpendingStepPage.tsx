import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Button } from 'react-native';

import { getHabit, type Habit } from '@/entities/habit';
import { SpendingForm } from '@/features/edit-spending';
import { Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

const next = () => router.replace('/onboarding/reasons');

// Шаг после старта: необязательный, назад на старт не ведет
export function SpendingStepPage() {
  const db = useSQLiteContext();
  const [habit, setHabit] = useState<Habit | null>(null);

  useEffect(() => {
    getHabit(db).then(setHabit);
  }, [db]);

  if (!habit) return null;

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
