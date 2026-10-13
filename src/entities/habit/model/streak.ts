// Чистая логика стрика, без React Native: ее гоняет node:test.
// Трезвый день - локальный календарный день строго после дня старта без срывов.

export type Streak = {
  current: number; // трезвых дней подряд, заканчивая сегодняшним
  best: number; // самая длинная серия
  total: number; // всего трезвых дней
  since: number; // начало текущей серии: старт или последний срыв, epoch ms
};

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// ponytail: перебор по дням O(дней), хватит на десятилетия истории
export function streak(
  startAt: number,
  relapseAts: number[],
  now: number,
): Streak {
  const relapses = relapseAts.filter((at) => at >= startAt && at <= now);
  const relapseDays = new Set(relapses.map((at) => dayKey(new Date(at))));

  const day = new Date(startAt);
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() + 1);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let run = 0;
  let best = 0;
  let total = 0;
  // setDate, а не +24ч: переход на летнее время не сбивает шаг
  for (; day <= today; day.setDate(day.getDate() + 1)) {
    if (relapseDays.has(dayKey(day))) {
      run = 0;
      continue;
    }
    run++;
    total++;
    best = Math.max(best, run);
  }

  return { current: run, best, total, since: Math.max(startAt, ...relapses) };
}
