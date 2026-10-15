import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { listDayReviewDates, listCompanyDates } from '@/entities/day-review';
import {
  achievementKeys,
  achievements,
  companyEvenings,
  getHabit,
  medalStates,
  soberDays,
  streak,
} from '@/entities/habit';
import { listSoberPartyStarts } from '@/entities/party';
import { listRelapses, type Relapse } from '@/entities/relapse';
import { syncNotifications } from '@/features/notifications';
import { toDay } from '@/shared/lib';

type Data = {
  startAt: number;
  now: number;
  relapses: Pick<Relapse, 'id' | 'at'>[];
  reviewDates: string[];
  soberParties: number[];
  companyDates: string[];
};

// Данные экрана "Прогресс". null - еще грузим
export function useProgress() {
  const db = useSQLiteContext();
  const [data, setData] = useState<Data | null>(null);

  const load = useCallback(() => {
    (async () => {
      const [habit, relapses, reviewDates, soberParties, companyDates] =
        await Promise.all([
          getHabit(db),
          listRelapses(db),
          listDayReviewDates(db),
          listSoberPartyStarts(db),
          listCompanyDates(db),
        ]);
      if (!habit) return;
      setData({
        startAt: habit.startAt,
        now: Date.now(),
        relapses,
        reviewDates,
        soberParties,
        companyDates,
      });
    })();
  }, [db]);

  useFocusEffect(load);

  if (!data) {
    return null;
  }

  const { startAt, now, relapses, reviewDates, soberParties, companyDates } =
    data;
  const relapseAts = relapses.map((r) => r.at);
  const days = soberDays(startAt, relapseAts, now);
  const { best, total, current } = streak(startAt, relapseAts, now);
  const company = { soberParties, companyDates };
  const got = achievements(days, reviewDates, toDay(now), company);
  const states = medalStates(
    got,
    current,
    companyEvenings(days, company).length,
  );

  return {
    startAt,
    now,
    days,
    best,
    total,
    reviewDates: new Set(reviewDates),
    got,
    states,
    gotCount: achievementKeys.filter((k) => got[k]).length,
    // удаление срыва из вечеринки снова делает ее идущей: нужен "как прошло?"
    reload: () => {
      syncNotifications(db);
      load();
    },
  };
}
