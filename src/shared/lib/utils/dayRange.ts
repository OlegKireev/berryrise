import { dayDate } from './dayDate';

// Границы локального дня YYYY-MM-DD: [from, to) в epoch ms.
// В день перехода на летнее время в сутках 23 или 25 часов
export const dayRange = (date: string) => ({
  from: dayDate(date).getTime(),
  to: dayDate(date, 1).getTime(),
});
