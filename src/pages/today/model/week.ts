// Полоска последних 7 дней на "Сегодня". Чистая логика для node:test

import type { Day } from '../../../entities/habit/model/streak.ts';
import type { DayStatus } from '../../../entities/habit/model/types.ts';
import { toDay } from '../../../shared/lib/utils/toDay.ts';

// weekday: 0 - понедельник, как в weekdays из i18n
export type WeekDay = { date: string; weekday: number; status: DayStatus };

// Шесть предыдущих дней и сегодня. Дня нет в days - это день старта или раньше
export function lastWeek(days: Day[], now: number): WeekDay[] {
  const sober = new Map(days.map((d) => [d.date, d.sober]));
  const day = new Date(now);
  day.setHours(12, 0, 0, 0);
  day.setDate(day.getDate() - 6);

  const week: WeekDay[] = [];

  // setDate, а не 24ч: переход на летнее время не сбивает шаг
  for (let i = 0; i < 7; i++, day.setDate(day.getDate() + 1)) {
    const date = toDay(day.getTime());
    const s = sober.get(date);
    week.push({
      date,
      weekday: (day.getDay() + 6) % 7,
      status: s === undefined ? null : s ? 'sober' : 'relapse',
    });
  }

  return week;
}
