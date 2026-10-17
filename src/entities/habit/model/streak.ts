// Чистая логика стрика, без React Native.
// Трезвый день - локальный календарный день строго после дня старта без срывов.

import { addDays, toDay } from '@/shared/lib';

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

  const today = toDay(now);
  const days: Day[] = [];

  // строки YYYY-MM-DD сравниваются лексикографически
  for (
    let date = addDays(toDay(startAt), 1);
    date <= today;
    date = addDays(date, 1)
  ) {
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
