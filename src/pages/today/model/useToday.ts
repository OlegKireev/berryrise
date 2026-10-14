import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import { reviewDay, getDayReview } from '@/entities/day-review';
import { getHabit, savings, streak, type Habit } from '@/entities/habit';
import {
  cancelParty,
  getActiveParty,
  setPartyResult,
  type Party,
} from '@/entities/party';
import { listRelapses } from '@/entities/relapse';
import { syncNotifications } from '@/features/notifications';
import { toDay } from '@/shared/lib';

// Данные экрана "Сегодня". null - еще грузим
export function useToday() {
  const db = useSQLiteContext();

  const [data, setData] = useState<{
    habit: Habit;
    relapseAts: number[];
    // день, за который итоги уже подведены
    filledDay: string | null;
    party: Party | null; // идущая вечеринка
  } | null>(null);
  const [now, setNow] = useState(Date.now);

  // Перечитываем при каждом фокусе, в том числе после закрытия модалки срыва
  const load = useCallback(() => {
    (async () => {
      const habit = await getHabit(db);
      if (!habit) return;
      const now = Date.now();
      const [relapses, review, party] = await Promise.all([
        listRelapses(db),
        getDayReview(db, reviewDay(now)),
        getActiveParty(db),
      ]);
      setData({
        habit,
        relapseAts: relapses.map((r) => r.at),
        filledDay: review?.date ?? null,
        party,
      });
      setNow(now);
    })();
  }, [db]);

  useFocusEffect(load);

  // В полночь прибавляется день, в 18:00 итоги переключаются на сегодня
  useEffect(() => {
    const next = new Date(now);
    next.setHours(next.getHours() < 18 ? 18 : 24, 0, 0, 0);
    const id = setTimeout(
      () => setNow(Date.now()),
      next.getTime() - Date.now(),
    );
    return () => clearTimeout(id);
  }, [now]);

  if (!data) {
    return null;
  }

  // ответ на вечеринку снимает ее "как прошло?"
  const afterParty = () => {
    syncNotifications(db);
    load();
  };

  const { habit, party } = data;
  const s = streak(habit.startAt, data.relapseAts, now);
  const day = reviewDay(now);

  return {
    streak: s,
    saved: savings(s.total, habit.weeklySpend, JSON.parse(habit.drinks)),
    currency: habit.currency,
    hasDrinks: habit.drinks !== '{}',
    party,
    // итоги дня
    reviewDay: day,
    isToday: day === toDay(now),
    reviewDone: data.filledDay === day,
    beforeStart: day < toDay(habit.startAt),
    markPartySober: (id: string) =>
      setPartyResult(db, id, 'sober').then(afterParty),
    cancelParty: (id: string) => cancelParty(db, id).then(afterParty),
  };
}
