import type { Habit } from '@/entities/habit';
import { Button } from '@/shared/ui';

import { DrinkCounts } from './DrinkCounts';
import { WeeklySpend } from './WeeklySpend';

import { useSpendingForm } from '../model/useSpendingForm';

type Props = {
  habit: Habit;
  submitLabel: string;
  onSaved: () => void;
};

// Траты и пресеты напитков: одна форма для онбординга и настроек
export function SpendingForm({ habit, submitLabel, onSaved }: Props) {
  const form = useSpendingForm(habit, onSaved);

  return (
    <>
      <WeeklySpend
        amount={form.amount}
        setAmount={form.setAmount}
        currency={form.currency}
        setCurrency={form.setCurrency}
      />
      <DrinkCounts
        counts={form.counts}
        setCount={form.setCount}
      />
      <Button
        variant="primary"
        title={submitLabel}
        disabled={form.saving}
        onPress={form.save}
      />
    </>
  );
}
