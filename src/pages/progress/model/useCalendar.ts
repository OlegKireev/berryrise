import { useState } from 'react';

import type { Day, DayStatus } from '@/entities/habit';

import { monthIndex, monthWeeks } from './calendar';

// Листание календаря от месяца старта до текущего
export function useCalendar(startAt: number, now: number, days: Day[]) {
  const [shown, setShown] = useState(() => monthIndex(now));
  // если экран вернулся из фона в новый месяц, не даем уйти за границы
  const first = monthIndex(startAt);
  const last = monthIndex(now);
  const index = Math.min(Math.max(shown, first), last);
  const year = Math.floor(index / 12);
  const month = index % 12;

  const sober = new Map(days.map((d) => [d.date, d.sober]));
  const status = (date: string): DayStatus => {
    const s = sober.get(date);

    if (s === undefined) {
      return null;
    }

    return s ? 'sober' : 'relapse';
  };

  return {
    year,
    month,
    weeks: monthWeeks(year, month),
    status,
    canPrev: index > first,
    canNext: index < last,
    prev: () => setShown(index - 1),
    next: () => setShown(index + 1),
  };
}
