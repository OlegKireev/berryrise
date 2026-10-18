import assert from 'node:assert/strict';

import { monthIndex, monthReviews, monthWeeks } from './calendar';

test('monthWeeks начинает неделю с понедельника и добивает до полной', () => {
  // Октябрь 2026 начинается в четверг, 31 день
  const weeks = monthWeeks(2026, 9);
  assert.equal(weeks.length, 5);
  assert.deepEqual(weeks[0], [
    null,
    null,
    null,
    '2026-10-01',
    '2026-10-02',
    '2026-10-03',
    '2026-10-04',
  ]);
  assert.deepEqual(weeks[4], [
    '2026-10-26',
    '2026-10-27',
    '2026-10-28',
    '2026-10-29',
    '2026-10-30',
    '2026-10-31',
    null,
  ]);
});

test('monthIndex растет на единицу через границу года', () => {
  assert.equal(
    monthIndex(new Date(2027, 0, 1).getTime()) -
      monthIndex(new Date(2026, 11, 31).getTime()),
    1,
  );
});

// Месяц с нуля, как в Date: oct(14, 9) = 14 октября 2026, 09:00 по местному времени
const oct = (d: number, h = 12) => new Date(2026, 9, d, h).getTime();
// дни YYYY-MM-DD месяца m (с нуля) с from по to включительно
const range = (m: number, from: number, to: number) =>
  new Set(
    Array.from(
      { length: to - from + 1 },
      (_, i) =>
        `2026-${String(m + 1).padStart(2, '0')}-${String(from + i).padStart(2, '0')}`,
    ),
  );

test('monthReviews: утром сегодня не считается', () => {
  assert.deepEqual(
    monthReviews(2026, 9, '2026-09-20', oct(14, 9), range(9, 1, 12)),
    {
      done: 12,
      total: 13,
      collected: false,
    },
  );
});

test('monthReviews: с 18:00 сегодня считается', () => {
  assert.equal(
    monthReviews(2026, 9, '2026-09-20', oct(14, 19), range(9, 1, 12)).total,
    14,
  );
});

test('monthReviews: месяц старта собран', () => {
  assert.deepEqual(
    monthReviews(2026, 8, '2026-09-20', oct(14), range(8, 20, 30)),
    {
      done: 11,
      total: 11,
      collected: true,
    },
  );
});

test('monthReviews: пропуск - не собран', () => {
  const dates = range(8, 20, 30);
  dates.delete('2026-09-25');
  assert.deepEqual(monthReviews(2026, 8, '2026-09-20', oct(14), dates), {
    done: 10,
    total: 11,
    collected: false,
  });
});

test('monthReviews: текущий месяц заполнен, но знака нет', () => {
  assert.deepEqual(
    monthReviews(2026, 9, '2026-09-20', oct(14, 21), range(9, 1, 14)),
    {
      done: 14,
      total: 14,
      collected: false,
    },
  );
});

test('monthReviews: старт сегодня днем - считать нечего', () => {
  assert.deepEqual(
    monthReviews(2026, 9, '2026-10-14', oct(14, 12), new Set()),
    {
      done: 0,
      total: 0,
      collected: false,
    },
  );
});
