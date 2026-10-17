// Единицы календаря и времени, чтобы не писать 7, 12, 60 и 24 по месту
export const DAYS_PER_WEEK = 7;
export const MONTHS_PER_YEAR = 12;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;

const MINUTE_MS = 60_000;
export const HOUR_MS = MINUTES_PER_HOUR * MINUTE_MS;
export const DAY_MS = HOURS_PER_DAY * HOUR_MS;

// День недели с понедельника: 0 - понедельник, 6 - воскресенье
export const weekdayFromMonday = (d: Date) =>
  (d.getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;

// Минуты от полуночи по часам даты
export const minutesOfDay = (d: Date) =>
  d.getHours() * MINUTES_PER_HOUR + d.getMinutes();

// Дата с временем суток из минут от полуночи. День - 1 января 1970, без перехода на летнее время;
// setHours сам переносит лишние минуты в часы
export const timeOfDay = (minutes: number) => {
  const d = new Date(0);
  d.setHours(0, minutes, 0, 0);
  return d;
};
