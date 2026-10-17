// Полоска последних 7 дней на "Сегодня". Чистая логика

import type { Day, DayStatus } from '@/entities/habit';
import { addDays, dayDate, toDay } from '@/shared/lib';

// weekday: 0 - понедельник, как в weekdays из i18n
export type WeekDay = { date: string; weekday: number; status: DayStatus };

// Шесть предыдущих дней и сегодня. Дня нет в days - это день старта или раньше
export function lastWeek(days: Day[], now: number): WeekDay[] {
  const sober = new Map(days.map((d) => [d.date, d.sober]));
  const today = toDay(now);

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i - 6);
    const s = sober.get(date);
    return {
      date,
      weekday: (dayDate(date).getDay() + 6) % 7,
      status: s === undefined ? null : s ? 'sober' : 'relapse',
    };
  });
}
