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
