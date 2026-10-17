// Чистая логика достижений, без React Native: ее гоняет node:test.
// Достижения не храним, а вычисляем из истории. Дата получения - YYYY-MM-DD.

import { dayDate } from '../../../shared/lib/utils/dayDate.ts';
import { toDay } from '../../../shared/lib/utils/toDay.ts';
import type { Day } from './streak.ts';

// после года - шаг в год, до 5 лет
const streakGoals = [
  1, 3, 7, 14, 30, 60, 90, 180, 365, 730, 1095, 1460, 1825,
] as const;
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

// Дата получения по ключу, неполученных медалей в объекте нет
export type Got = Partial<Record<AchievementKey, string>>;

const nextDay = (date: string) => toDay(dayDate(date, 1).getTime());

const FRIDAY = 5;
const SUNDAY = 0;

type Company = {
  soberParties: number[]; // начала вечеринок с ответом "без алкоголя"
  companyDates: string[]; // итоги дня с местом "компания" или "бар"
};

// Вечер в компании - календарный день. Трезвой вечеринке верим на слово,
// а место из итогов засчитываем, только если день трезвый: "был в баре" не значит "не пил".
// Отдает даты засчитанных вечеров по порядку
export function companyEvenings(days: Day[], company: Company): string[] {
  const soberDates = new Set(days.filter((d) => d.sober).map((d) => d.date));
  return [
    ...new Set([
      ...company.soberParties.map(toDay),
      ...company.companyDates.filter((d) => soberDates.has(d)),
    ]),
  ].sort();
}

export function achievements(
  days: Day[], // из soberDays: подряд, без пропусков
  reviewDates: string[], // YYYY-MM-DD, любой порядок
  today: string, // YYYY-MM-DD
  company: Company = { soberParties: [], companyDates: [] },
): Got {
  const got: Got = {};
  const give = (key: AchievementKey, date: string) => {
    got[key] ??= date;
  };

  let run = 0;
  let afterRelapse = false; // текущая серия началась сразу после дня срыва
  days.forEach(({ date, sober }) => {
    if (!sober) {
      run = 0;
      afterRelapse = true;
      return;
    }

    run++;

    for (const n of streakGoals) {
      if (run === n) {
        give(`days${n}`, date);
      }
    }

    if (afterRelapse && run === 7) {
      give('comeback7', date);
    }

    // пятница и выходные засчитываются, только когда день закончился
    if (date >= today) {
      return;
    }

    const weekday = dayDate(date).getDay();

    if (weekday === FRIDAY) {
      give('friday', date);
    }

    // дни идут подряд, поэтому серия от 3 в воскресенье = трезвые пт, сб и вс
    if (weekday === SUNDAY && run >= 3) {
      give('weekend', date);
    }
  });

  let row = 0;
  let prev: string | null = null;

  for (const date of [...new Set(reviewDates)].sort()) {
    row = prev !== null && nextDay(prev) === date ? row + 1 : 1;

    if (row === 7) {
      give('reviews7', date);
    }

    prev = date;
  }

  const evenings = companyEvenings(days, company);

  for (const n of companyGoals) {
    const date = evenings[n - 1];

    if (date) {
      give(`company${n}`, date);
    }
  }

  return got;
}

export type MedalState = { state: 'got' } | { state: 'next'; left?: number }; // left - сколько осталось, только у стрика и компании

// Серии: стрик и компания; остальные достижения - серии из одной медали.
// Первая неполученная в серии - следующая, дальше по серии медали скрыты: ключа в ответе нет
export function medalStates(
  got: Got,
  currentRun: number, // текущая серия трезвых дней, streak().current
  evenings: number, // засчитанных вечеров в компании
): Partial<Record<AchievementKey, MedalState>> {
  const states: Partial<Record<AchievementKey, MedalState>> = {};
  const series = (items: readonly { key: AchievementKey; left?: number }[]) => {
    let found = false;

    for (const { key, left } of items) {
      if (got[key]) {
        states[key] = { state: 'got' };
      } else if (!found) {
        found = true;
        states[key] = { state: 'next', left };
      }
    }
  };
  const streakSeries = streakGoals.map((n) => ({
    key: `days${n}` as const,
    left: n - currentRun,
  }));
  const companySeries = companyGoals.map((n) => ({
    key: `company${n}` as const,
    left: n - evenings,
  }));
  series(streakSeries);
  series(companySeries);
  const inSeries = new Set<AchievementKey>(
    [...streakSeries, ...companySeries].map((s) => s.key),
  );

  for (const k of achievementKeys) {
    // возвращение после срыва скрыто до получения: цель не должна подталкивать к срыву
    if (k === 'comeback7') {
      if (got[k]) {
        states[k] = { state: 'got' };
      }
    } else if (!inSeries.has(k)) {
      series([{ key: k }]);
    }
  }

  return states;
}
