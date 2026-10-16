import { useFocusEffect } from 'expo-router';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { listDayReviewsBetween } from '@/entities/day-review';
import { getHabit } from '@/entities/habit';
import { listPartyResultsBetween } from '@/entities/party';
import { listRelapsesBetween } from '@/entities/relapse';
import type { Hardship, Helper, Place } from '@/shared/config';
import { dayRange } from '@/shared/lib';

import { insights, periodDays, periods } from './insights';

const list = <T>(json: string | null): T[] => (json ? JSON.parse(json) : []);

// index - номер периода в списке: 0 - последние 30 дней, дальше месяцы назад
const load = async (db: SQLiteDatabase, index: number) => {
  const habit = await getHabit(db);
  if (!habit) return null;
  const now = Date.now();
  const all = periods(habit.startAt, now);
  // экран мог пережить смену месяца: не уходим за конец списка
  const i = Math.min(index, all.length - 1);
  const period = all[i]!;
  const days = periodDays(period, now);
  const from = dayRange(days[0]!).from;
  const to = dayRange(days.at(-1)!).to;
  const [reviews, relapses, partyResults] = await Promise.all([
    listDayReviewsBetween(db, days[0]!, days.at(-1)!),
    listRelapsesBetween(db, from, to),
    listPartyResultsBetween(db, from, to),
  ]);
  return {
    index: i,
    count: all.length,
    period,
    ...insights({
      reviews: reviews.map((r) => ({
        date: r.date,
        mood: r.mood,
        craving: r.craving,
        hardships: list<Hardship>(r.hardships),
        helpers: list<Helper>(r.helpers),
      })),
      relapses: relapses.map((r) => ({
        places: list<Place>(r.places),
        hardships: list<Hardship>(r.hardships),
      })),
      partyResults,
    }),
  };
};

type Data = NonNullable<Awaited<ReturnType<typeof load>>>;

// Статистика за выбранный период и листание периодов. null - еще грузим первый раз.
// Перечитывает на фокусе и при смене периода, до загрузки нового отдает прежний
export function useInsights() {
  const db = useSQLiteContext();
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<Data | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      load(db, index).then((d) => active && d && setData(d));
      return () => {
        active = false;
      };
    }, [db, index]),
  );

  if (!data) {
    return null;
  }

  return {
    ...data,
    canPrev: data.index < data.count - 1,
    canNext: data.index > 0,
    prev: () => setIndex(data.index + 1),
    next: () => setIndex(data.index - 1),
  };
}
