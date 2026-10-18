import assert from 'node:assert/strict';

import { soberDays } from '@/entities/habit';
import { toDay } from '@/shared/lib';

import { lastWeek } from './week';

// Месяц с нуля, как в Date: oct(13, 9) = 13 октября, 09:00 по местному времени
const oct = (d: number, h = 12) => new Date(2026, 9, d, h).getTime();

const statuses = (startAt: number, relapses: number[], now: number) =>
  lastWeek(
    soberDays(startAt, relapses, now),
    now,
    toDay(startAt),
    new Set(),
  ).map((d) => d.status);

test('неделя без срывов', () => {
  assert.deepEqual(statuses(oct(3), [], oct(13)), Array(7).fill('sober'));
});

test('срыв позавчера', () => {
  assert.deepEqual(statuses(oct(3), [oct(11, 22)], oct(13)), [
    'sober',
    'sober',
    'sober',
    'sober',
    'relapse',
    'sober',
    'sober',
  ]);
});

test('старт вчера: закрашено только сегодня', () => {
  assert.deepEqual(statuses(oct(12), [], oct(13)), [
    ...Array<null>(6).fill(null),
    'sober',
  ]);
});

test('дни недели: 13.10.2026 - вторник', () => {
  assert.deepEqual(
    lastWeek([], oct(13), '2026-10-01', new Set()).map((d) => d.weekday),
    [2, 3, 4, 5, 6, 0, 1],
  );
});

test('сегодня справа, даты подряд через переход на зимнее время', () => {
  // в Берлине 25 октября 2026 часы переводятся назад
  const week = lastWeek([], oct(28, 0), '2026-10-01', new Set());
  assert.deepEqual(
    week.map((d) => d.date),
    [
      '2026-10-22',
      '2026-10-23',
      '2026-10-24',
      '2026-10-25',
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
    ],
  );
});

test('точки у дней с итогами', () => {
  const week = lastWeek(
    [],
    oct(13),
    '2026-10-01',
    new Set(['2026-10-11', '2026-10-12', '2026-09-30']),
  );
  assert.deepEqual(
    week.map((d) => d.reviewed),
    [false, false, false, false, true, true, false],
  );
});

test('открываются дни со старта по сегодня', () => {
  // старт 10.10: 7, 8 и 9 октября раньше старта
  const week = lastWeek([], oct(13), '2026-10-10', new Set());
  assert.deepEqual(
    week.map((d) => d.canOpen),
    [false, false, false, true, true, true, true],
  );
});
