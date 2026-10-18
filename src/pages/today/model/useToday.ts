import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import {
  listDayReviewDates,
  REVIEW_CUTOFF_HOUR,
  reviewDay,
} from '@/entities/day-review';
import {
  getHabit,
  savings,
  soberDays,
  streak,
  type Habit,
} from '@/entities/habit';
import { getActiveParty, setPartyResult, type Party } from '@/entities/party';
import { listReasons, reasonOfDay, type ReasonRow } from '@/entities/reason';
import { listRelapses } from '@/entities/relapse';
import { useCelebrate } from '@/features/celebrate-achievement';
import { syncNotifications } from '@/features/notifications';
import { HOURS_PER_DAY, toDay } from '@/shared/lib';

import { lastWeek } from './week';

// Данные экрана "Сегодня". null - еще грузим
export function useToday() {
  const db = useSQLiteContext();

  const [data, setData] = useState<{
    habit: Habit;
    relapseAts: number[];
    // дни, за которые итоги уже подведены
    reviewDates: Set<string>;
    party: Party | null; // идущая вечеринка
    reasons: ReasonRow[];
  } | null>(null);
  const [now, setNow] = useState(Date.now);
  const celebrate = useCelebrate();

  // Перечитываем при каждом фокусе, в том числе после закрытия модалки срыва
  const load = useCallback(() => {
    (async () => {
      const habit = await getHabit(db);

      if (!habit) {
        return;
      }

      const now = Date.now();
      const [relapses, party, reasons, reviewDates] = await Promise.all([
        listRelapses(db),
        getActiveParty(db),
        listReasons(db),
        listDayReviewDates(db),
      ]);
      setData({
        habit,
        relapseAts: relapses.map((r) => r.at),
        party,
        reasons,
        reviewDates: new Set(reviewDates),
      });
      setNow(now);
    })();
  }, [db]);

  useFocusEffect(load);

  // В полночь прибавляется день, в 18:00 итоги переключаются на сегодня
  useEffect(() => {
    const next = new Date(now);
    next.setHours(
      next.getHours() < REVIEW_CUTOFF_HOUR ? REVIEW_CUTOFF_HOUR : HOURS_PER_DAY,
      0,
      0,
      0,
    );
    const id = setTimeout(
      () => setNow(Date.now()),
      next.getTime() - Date.now(),
    );
    return () => clearTimeout(id);
  }, [now]);

  if (!data) {
    return null;
  }

  // ответ на вечеринку снимает ее "как прошло?" и может дать медаль
  const afterParty = () => {
    syncNotifications(db);
    load();
    celebrate();
  };

  const { habit, party } = data;
  const s = streak(habit.startAt, data.relapseAts, now);
  const day = reviewDay(now);

  return {
    streak: s,
    // null - причин нет
    reason: reasonOfDay(data.reasons, toDay(now)),
    week: lastWeek(
      soberDays(habit.startAt, data.relapseAts, now),
      now,
      toDay(habit.startAt),
      data.reviewDates,
    ),
    saved: savings(s.total, habit.weeklySpend, habit.drinks),
    currency: habit.currency,
    hasDrinks: Object.keys(habit.drinks).length > 0,
    party,
    // вечер закончился по времени: пора спросить "как прошло?"
    partyEnded: !!party && party.expectedEndAt <= now,
    // итоги дня
    reviewDay: day,
    isToday: day === toDay(now),
    reviewDone: data.reviewDates.has(day),
    beforeStart: day < toDay(habit.startAt),
    markPartySober: (id: string) =>
      setPartyResult(db, id, 'sober').then(afterParty),
  };
}
