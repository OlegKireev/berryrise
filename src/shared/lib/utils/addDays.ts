import { dayDate } from './dayDate';
import { toDay } from './toDay';

// День YYYY-MM-DD со сдвигом на n дней. Через dayDate: переход на летнее время не сбивает шаг
export const addDays = (date: string, n: number) =>
  toDay(dayDate(date, n).getTime());
