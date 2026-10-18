import type { Habit } from '@/entities/habit';
import { SpendingForm, useSpendingForm } from '@/features/edit-spending';
import { DateTimeField, Screen, Text } from '@/shared/ui';

import { useSettings } from '../model/useSettings';

import { t } from '../i18n';

export function StartSpendingPage() {
  const settings = useSettings();

  if (!settings) {
    return null;
  }

  return (
    <Screen>
      <Text variant="label">{t('startAt')}</Text>
      <DateTimeField
        mode="date"
        value={new Date(settings.habit.startAt)}
        onChange={settings.changeStart}
        max={new Date(settings.maxStart)}
      />
      <Spending habit={settings.habit} />
    </Screen>
  );
}

// Хуку формы нужна загруженная привычка, поэтому отдельный компонент
function Spending({ habit }: { habit: Habit }) {
  return <SpendingForm form={useSpendingForm(habit)} />;
}
