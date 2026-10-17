import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';

import {
  drinks,
  updateSpending,
  type Drink,
  type Habit,
} from '@/entities/habit';
import { getLocale, logError } from '@/shared/lib';

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

type Form = {
  amount: string;
  currency: string;
  counts: Partial<Record<Drink, string>>;
};

// Поля ввода держим строками. Каждое изменение сразу пишем в базу всей формой,
// записи идут по очереди, чтобы последней всегда оказалась последняя версия
export function useSpendingForm(habit: Habit) {
  const db = useSQLiteContext();
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  const [form, setForm] = useState<Form>(() => ({
    amount: habit.weeklySpend?.toString() ?? '',
    currency: habit.currency ?? (getLocale() === 'ru' ? 'RUB' : 'USD'),
    counts: Object.fromEntries(
      Object.entries(habit.drinks).map(([k, n]) => [k, String(n)]),
    ),
  }));

  const change = (patch: Partial<Form>) => {
    const next = { ...form, ...patch };
    setForm(next);
    queue.current = queue.current
      .then(() =>
        updateSpending(db, habit.id, {
          weeklySpend: toInt(next.amount),
          currency: next.currency,
          drinks: Object.fromEntries(
            drinks.map((d) => [d, toInt(next.counts[d] ?? '') ?? 0]),
          ),
        }),
      )
      .catch((e: unknown) => logError('spending', e));
  };

  return {
    ...form,
    setAmount: (s: string) => change({ amount: digits(s) }),
    setCurrency: (currency: string) => change({ currency }),
    setCount: (d: Drink, s: string) =>
      change({ counts: { ...form.counts, [d]: digits(s) } }),
  };
}
