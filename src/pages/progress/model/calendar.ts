import { canReview } from '@/entities/day-review';
import {
  DAYS_PER_WEEK,
  MONTHS_PER_YEAR,
  toDay,
  weekdayFromMonday,
} from '@/shared/lib';

// Номер месяца от нулевого года, чтобы листать и сравнивать месяцы одним числом
export const monthIndex = (ms: number) => {
  const d = new Date(ms);
  return d.getFullYear() * MONTHS_PER_YEAR + d.getMonth();
};

// Недели месяца с понедельника, null - добивка до полной недели
export function monthWeeks(year: number, month: number): (string | null)[][] {
  const first = new Date(year, month, 1);
  const length = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array<null>(weekdayFromMonday(first)).fill(
    null,
  );

  for (let d = 1; d <= length; d++) {
    cells.push(toDay(new Date(year, month, d).getTime()));
  }

  while (cells.length % DAYS_PER_WEEK) {
    cells.push(null);
  }

  return Array.from({ length: cells.length / DAYS_PER_WEEK }, (_, i) =>
    cells.slice(i * DAYS_PER_WEEK, (i + 1) * DAYS_PER_WEEK),
  );
}

// Итоги месяца как коллекция. total - дни месяца с дня старта, которые уже можно заполнить
// (прошедшие и сегодня с 18:00), done - из них с итогами. collected - законченный месяц
// собран целиком: у текущего знака нет, иначе он пропадал бы каждое утро
export function monthReviews(
  year: number,
  month: number,
  start: string,
  now: number,
  reviewDates: Set<string>,
) {
  const today = toDay(now);
  const length = new Date(year, month + 1, 0).getDate();
  let total = 0;
  let done = 0;

  for (let d = 1; d <= length; d++) {
    const date = toDay(new Date(year, month, d).getTime());

    if (date >= start && date <= today && canReview(date, now)) {
      total++;
      done += reviewDates.has(date) ? 1 : 0;
    }
  }

  const past = year * MONTHS_PER_YEAR + month < monthIndex(now);
  return { done, total, collected: past && total > 0 && done === total };
}
