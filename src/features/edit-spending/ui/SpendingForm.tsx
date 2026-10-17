import { DrinkCounts } from './DrinkCounts';
import { WeeklySpend } from './WeeklySpend';

import type { SpendingFormState } from '../model/useSpendingForm';

// Траты и пресеты напитков: одна форма для онбординга и настроек, сохраняется сразу
export function SpendingForm({ form }: { form: SpendingFormState }) {
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
    </>
  );
}
