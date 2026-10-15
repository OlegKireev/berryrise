// Чистая логика достижений, без React Native: ее гоняет node:test.
// Достижения не храним, а вычисляем из истории. Дата получения - YYYY-MM-DD.

import { toDay } from '../../../shared/lib/utils/toDay.ts';
import type { Day } from './streak.ts';

const streakGoals = [1, 3, 7, 14, 30, 60, 90, 180, 365] as const;
const companyGoals = [1, 5, 10] as const;

// Порядок в массиве = порядок на экране
export const achievementKeys = [
  ...streakGoals.map((n) => `days${n}` as const),
  'friday',
  'weekend',
  'reviews7',
  'comeback7',
  ...companyGoals.map((n) => `company${n}` as const),
] as const;
export type AchievementKey = (typeof achievementKeys)[number];

const parse = (date: string) => {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
};

// setDate, а не +24ч: переход на летнее время не сбивает шаг
const nextDay = (date: string) => {
  const d = parse(date);
  d.setDate(d.getDate() + 1);
  return toDay(d.getTime());
};

const FRIDAY = 5;
const SUNDAY = 0;

export function achievements(
  days: Day[], // из soberDays: подряд, без пропусков
  reviewDates: string[], // YYYY-MM-DD, любой порядок
  today: string, // YYYY-MM-DD
  company: {
    soberParties: number[]; // начала вечеринок с ответом "без алкоголя"
    companyDates: string[]; // итоги дня с местом "компания" или "бар"
  } = { soberParties: [], companyDates: [] },
): Record<AchievementKey, string | null> {
  const got = Object.fromEntries(
    achievementKeys.map((k) => [k, null]),
  ) as Record<AchievementKey, string | null>;
  const give = (key: AchievementKey, date: string) => {
    got[key] ??= date;
  };

  let run = 0;
  let afterRelapse = false; // текущая серия началась сразу после дня срыва
  days.forEach(({ date, sober }, i) => {
    if (!sober) {
      run = 0;
      afterRelapse = true;
      return;
    }
    run++;
    for (const n of streakGoals) if (run === n) give(`days${n}`, date);
    if (afterRelapse && run === 7) give('comeback7', date);

    // пятница и выходные засчитываются, только когда день закончился
    if (date >= today) return;
    const weekday = parse(date).getDay();
    if (weekday === FRIDAY) give('friday', date);
    // дни идут подряд, поэтому серия от 3 в воскресенье = трезвые пт, сб и вс
    if (weekday === SUNDAY && run >= 3) give('weekend', date);
  });

  let row = 0;
  let prev: string | null = null;
  for (const date of [...new Set(reviewDates)].sort()) {
    row = prev !== null && nextDay(prev) === date ? row + 1 : 1;
    if (row === 7) give('reviews7', date);
    prev = date;
  }

  // Вечер в компании - календарный день. Трезвой вечеринке верим на слово,
  // а место из итогов засчитываем, только если день трезвый: "был в баре" не значит "не пил"
  const soberDates = new Set(days.filter((d) => d.sober).map((d) => d.date));
  const evenings = [
    ...new Set([
      ...company.soberParties.map(toDay),
      ...company.companyDates.filter((d) => soberDates.has(d)),
    ]),
  ].sort();
  for (const n of companyGoals)
    if (evenings.length >= n) give(`company${n}`, evenings[n - 1]!);

  return got;
}
