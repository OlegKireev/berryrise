// Чистая логика дня чек-ина, без React Native: ее гоняет node:test.
// До 18:00 заполняется чек-ин за вчера, с 18:00 за сегодня.

const CUTOFF_HOUR = 18;

const pad = (n: number) => String(n).padStart(2, '0');

// Локальная дата в формате YYYY-MM-DD. Такие строки сравниваются лексикографически
export const toDay = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export function checkinDay(now: number): string {
  const d = new Date(now);
  // setDate, а не минус 24ч: переход на летнее время не сбивает день
  if (d.getHours() < CUTOFF_HOUR) d.setDate(d.getDate() - 1);
  return toDay(d.getTime());
}
