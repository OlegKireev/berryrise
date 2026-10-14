import { toDay } from '../../../shared/lib/utils/toDay.ts';

// Номер месяца от нулевого года, чтобы листать и сравнивать месяцы одним числом
export const monthIndex = (ms: number) => {
  const d = new Date(ms);
  return d.getFullYear() * 12 + d.getMonth();
};

// Недели месяца с понедельника, null - добивка до полной недели
export function monthWeeks(year: number, month: number): (string | null)[][] {
  const first = new Date(year, month, 1);
  const length = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array((first.getDay() + 6) % 7).fill(null);
  for (let d = 1; d <= length; d++) {
    cells.push(toDay(new Date(year, month, d).getTime()));
  }
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, i) =>
    cells.slice(i * 7, i * 7 + 7),
  );
}
