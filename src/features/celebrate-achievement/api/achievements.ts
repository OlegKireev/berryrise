import type { SQLiteDatabase } from 'expo-sqlite';

import { listCompanyDates, listDayReviewDates } from '@/entities/day-review';
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
import { listRelapses } from '@/entities/relapse';
import { toDay } from '@/shared/lib';

// История и медали на момент now. Трогает пять сущностей, поэтому это фича.
// null - онбординг не пройден. startAt - посчитать для другого старта, не трогая базу
export async function loadAchievements(
  db: SQLiteDatabase,
  now: number,
  startAt?: number,
) {
  const [habit, relapses, reviewDates, soberParties, companyDates] =
    await Promise.all([
      getHabit(db),
      listRelapses(db),
      listDayReviewDates(db),
      listSoberPartyStarts(db),
      listCompanyDates(db),
    ]);

  if (!habit) {
    return null;
  }

  const start = startAt ?? habit.startAt;
  const relapseAts = relapses.map((r) => r.at);
  const days = soberDays(start, relapseAts, now);
  const { best, total, current } = streak(start, relapseAts, now);
  const company = { soberParties, companyDates };
  const got = achievements(days, reviewDates, toDay(now), company);
  const states = medalStates(
    got,
    current,
    companyEvenings(days, company).length,
  );

  return {
    startAt: start,
    reviewDates,
    days,
    best,
    total,
    current,
    got,
    states,
    gotCount: achievementKeys.filter((k) => got[k]).length,
  };
}
