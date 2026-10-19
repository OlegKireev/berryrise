import type { Habit } from '@/entities/habit';
import { SpendingForm, useSpendingForm } from '@/features/edit-spending';
import { Screen } from '@/shared/ui';

import { useSettings } from '../model/useSettings';

export function SpendingPage() {
  const settings = useSettings();

  if (!settings) {
    return null;
  }

  return (
    <Screen>
      <Spending habit={settings.habit} />
    </Screen>
  );
}

// Хуку формы нужна загруженная привычка, поэтому отдельный компонент
function Spending({ habit }: { habit: Habit }) {
  return <SpendingForm form={useSpendingForm(habit)} />;
}
