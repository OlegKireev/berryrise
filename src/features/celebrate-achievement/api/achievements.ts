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
// null - онбординг не пройден
export async function loadAchievements(db: SQLiteDatabase, now: number) {
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

  const relapseAts = relapses.map((r) => r.at);
  const days = soberDays(habit.startAt, relapseAts, now);
  const { best, total, current } = streak(habit.startAt, relapseAts, now);
  const company = { soberParties, companyDates };
  const got = achievements(days, reviewDates, toDay(now), company);
  const states = medalStates(
    got,
    current,
    companyEvenings(days, company).length,
  );

  return {
    startAt: habit.startAt,
    reviewDates,
    days,
    best,
    total,
    got,
    states,
    gotCount: achievementKeys.filter((k) => got[k]).length,
  };
}
