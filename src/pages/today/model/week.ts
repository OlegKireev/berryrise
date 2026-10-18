// Полоска последних 7 дней на "Сегодня". Чистая логика

import type { Day, DayStatus } from '@/entities/habit';
import {
  addDays,
  dayDate,
  DAYS_PER_WEEK,
  toDay,
  weekdayFromMonday,
} from '@/shared/lib';

// weekday: 0 - понедельник, как в weekdays из i18n.
// reviewed - есть итоги дня, canOpen - день от старта по сегодня, открывает карточку дня
export type WeekDay = {
  date: string;
  weekday: number;
  status: DayStatus;
  reviewed: boolean;
  canOpen: boolean;
};

// Шесть предыдущих дней и сегодня. Дня нет в days - это день старта или раньше.
// start - день старта, reviewDates - дни с итогами (YYYY-MM-DD)
export function lastWeek(
  days: Day[],
  now: number,
  start: string,
  reviewDates: Set<string>,
): WeekDay[] {
  const sober = new Map(days.map((d) => [d.date, d.sober]));
  const today = toDay(now);

  return Array.from({ length: DAYS_PER_WEEK }, (_, i) => {
    const date = addDays(today, i - DAYS_PER_WEEK + 1);
    const s = sober.get(date);
    return {
      date,
      weekday: weekdayFromMonday(dayDate(date)),
      status: s === undefined ? null : s ? 'sober' : 'relapse',
      reviewed: reviewDates.has(date),
      canOpen: date >= start,
    };
  });
}
