import { router } from 'expo-router';

import type { Habit } from '@/entities/habit';
import { SpendingForm, useSpendingForm } from '@/features/edit-spending';
import { Button, Screen, Text } from '@/shared/ui';

import { useHabit } from '../model/useHabit';

import { t } from '../i18n';

// Шаг после старта: необязательный, корень стека после старта, "назад" сворачивает приложение.
// Форма сохраняется сама, "Пропустить" очищает ее
export function SpendingStepPage() {
  const habit = useHabit();

  if (!habit) {
    return null;
  }

  return <SpendingStep habit={habit} />;
}

// Хуку формы нужна загруженная привычка, поэтому отдельный компонент
function SpendingStep({ habit }: { habit: Habit }) {
  const form = useSpendingForm(habit);

  return (
    <Screen
      footer={
        <>
          <Button
            variant="primary"
            title={t('next')}
            href="/onboarding/reasons"
          />
          <Button
            variant="quiet"
            title={t('skip')}
            onPress={() => {
              form.clear();
              router.push('/onboarding/reasons');
            }}
          />
        </>
      }
    >
      <Text variant="title">{t('spendingTitle')}</Text>
      <Text>{t('spendingHint')}</Text>
      <SpendingForm form={form} />
    </Screen>
  );
}
