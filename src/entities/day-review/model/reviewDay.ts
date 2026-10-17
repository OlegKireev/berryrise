// Чистая логика дня для итогов, без React Native.
// До 18:00 подводятся итоги за вчера, с 18:00 за сегодня.

import { addDays, toDay } from '@/shared/lib';

export const REVIEW_CUTOFF_HOUR = 18;

export function reviewDay(now: number): string {
  const today = toDay(now);
  return new Date(now).getHours() < REVIEW_CUTOFF_HOUR
    ? addDays(today, -1)
    : today;
}
