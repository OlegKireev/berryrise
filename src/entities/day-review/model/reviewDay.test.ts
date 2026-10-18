import assert from 'node:assert/strict';

import { canReview, reviewDay } from './reviewDay';

// Месяц с нуля, как в Date: oct(14, 9, 30) = 14 октября, 09:30 по местному времени
const oct = (d: number, h = 12, min = 0) =>
  new Date(2026, 9, d, h, min).getTime();

test('утром итоги за вчера', () => {
  assert.equal(reviewDay(oct(14, 9, 30)), '2026-10-13');
});

test('в 17:59 еще за вчера', () => {
  assert.equal(reviewDay(oct(14, 17, 59)), '2026-10-13');
});

test('ровно в 18:00 уже за сегодня', () => {
  assert.equal(reviewDay(oct(14, 18)), '2026-10-14');
});

test('после полуночи за вчера', () => {
  assert.equal(reviewDay(oct(15, 0, 40)), '2026-10-14');
});

test('утро после перехода на летнее время', () => {
  // В Берлине 29 марта 2026 в 02:00 часы переводят на 03:00
  assert.equal(reviewDay(new Date(2026, 2, 29, 3, 30).getTime()), '2026-03-28');
  assert.equal(reviewDay(new Date(2026, 2, 30, 0, 30).getTime()), '2026-03-29');
});

test('прошлый день можно заполнить и утром', () => {
  assert.equal(canReview('2026-10-13', oct(14, 9, 30)), true);
});

test('сегодня в 17:59 еще нельзя', () => {
  assert.equal(canReview('2026-10-14', oct(14, 17, 59)), false);
});

test('сегодня с 18:00 можно', () => {
  assert.equal(canReview('2026-10-14', oct(14, 18)), true);
});
