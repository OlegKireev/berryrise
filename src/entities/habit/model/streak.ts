// Чистая логика стрика, без React Native: ее гоняет node:test.
// Трезвый день - локальный календарный день строго после дня старта без срывов.

import { toDay } from '../../../shared/lib/utils/toDay.ts';

export type Day = { date: string; sober: boolean }; // date: YYYY-MM-DD

export type Streak = {
  current: number; // трезвых дней подряд, заканчивая сегодняшним
  best: number; // самая длинная серия
  total: number; // всего трезвых дней
  since: number; // начало текущей серии: старт или последний срыв, epoch ms
};

const relapsesInRange = (startAt: number, relapseAts: number[], now: number) =>
  relapseAts.filter((at) => at >= startAt && at <= now);

// Все дни от дня после старта до сегодня включительно, по порядку и без пропусков.
// ponytail: перебор по дням O(дней), хватит на десятилетия истории
export function soberDays(
  startAt: number,
  relapseAts: number[],
  now: number,
): Day[] {
  const relapseDays = new Set(
    relapsesInRange(startAt, relapseAts, now).map(toDay),
  );

  const day = new Date(startAt);
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() + 1);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const days: Day[] = [];

  // setDate, а не +24ч: переход на летнее время не сбивает шаг
  for (; day <= today; day.setDate(day.getDate() + 1)) {
    const date = toDay(day.getTime());
    days.push({ date, sober: !relapseDays.has(date) });
  }

  return days;
}

export function streak(
  startAt: number,
  relapseAts: number[],
  now: number,
): Streak {
  let run = 0;
  let best = 0;
  let total = 0;

  for (const { sober } of soberDays(startAt, relapseAts, now)) {
    run = sober ? run + 1 : 0;

    if (sober) {
      total++;
    }

    best = Math.max(best, run);
  }

  const relapses = relapsesInRange(startAt, relapseAts, now);
  return { current: run, best, total, since: Math.max(startAt, ...relapses) };
}
