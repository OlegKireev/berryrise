import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';

import {
  drinks,
  updateSpending,
  type Drink,
  type Habit,
} from '@/entities/habit';
import { getLocale } from '@/shared/lib';

// ponytail: короткий список частых валют, расширим по запросу
export const currencies = [
  'RUB',
  'USD',
  'EUR',
  'GEL',
  'KZT',
  'UAH',
  'BYN',
  'GBP',
  'TRY',
  'AMD',
];

const digits = (s: string) => s.replace(/\D/g, '');
const toInt = (s: string) => (s === '' ? null : Number(s));

// Поля ввода держим строками, в числа переводим при сохранении
export function useSpendingForm(habit: Habit, onSaved: () => void) {
  const db = useSQLiteContext();

  const [amount, setAmount] = useState(habit.weeklySpend?.toString() ?? '');
  const [currency, setCurrency] = useState(
    habit.currency ?? (getLocale() === 'ru' ? 'RUB' : 'USD'),
  );
  const [counts, setCounts] = useState<Partial<Record<Drink, string>>>(() =>
    Object.fromEntries(
      Object.entries(JSON.parse(habit.drinks) as Record<Drink, number>).map(
        ([k, n]) => [k, String(n)],
      ),
    ),
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await updateSpending(db, habit.id, {
      weeklySpend: toInt(amount),
      currency,
      drinks: Object.fromEntries(
        drinks.map((d) => [d, toInt(counts[d] ?? '') ?? 0]),
      ),
    });
    setSaving(false);
    onSaved();
  };

  return {
    amount,
    setAmount: (s: string) => setAmount(digits(s)),
    currency,
    setCurrency,
    counts,
    setCount: (d: Drink, s: string) => setCounts({ ...counts, [d]: digits(s) }),
    saving,
    save,
  };
}
