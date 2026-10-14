// Чистая логика дня для итогов, без React Native: ее гоняет node:test.
// До 18:00 подводятся итоги за вчера, с 18:00 за сегодня.

import { toDay } from '../../../shared/lib/utils/toDay.ts';

const CUTOFF_HOUR = 18;

export function reviewDay(now: number): string {
  const d = new Date(now);
  // setDate, а не минус 24ч: переход на летнее время не сбивает день
  if (d.getHours() < CUTOFF_HOUR) d.setDate(d.getDate() - 1);
  return toDay(d.getTime());
}
