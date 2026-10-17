import { at } from './at.ts';

// Локальная полночь дня YYYY-MM-DD, shift - сдвиг в днях.
// Разбираем руками: new Date('YYYY-MM-DD') трактуется как UTC.
// Через конструктор Date, а не +24ч: переход на летнее время не сбивает шаг
export function dayDate(date: string, shift = 0) {
  const parts = date.split('-').map(Number);
  return new Date(at(parts, 0), at(parts, 1) - 1, at(parts, 2) + shift);
}
