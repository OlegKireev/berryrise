/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { toDay } from '../../../shared/lib/utils/toDay.ts';
import { achievements } from './achievements.ts';
import { soberDays } from './streak.ts';

// Месяц с нуля, как в Date: oct(13, 9) = 13 октября 2026, 09:00 по местному времени.
// 16.10.2026 - пятница
const oct = (d: number, h = 12, min = 0) =>
  new Date(2026, 9, d, h, min).getTime();
const day = (d: number) => toDay(oct(d));

const get = (
  startAt: number,
  relapseAts: number[],
  now: number,
  reviewDates: string[] = [],
) => achievements(soberDays(startAt, relapseAts, now), reviewDates, toDay(now));

test('первый день в полночь', () => {
  assert.equal(get(oct(13, 23, 50), [], oct(14, 0)).days1, day(14));
});

test('дни кусками не складываются', () => {
  const a = get(oct(1), [oct(6), oct(11)], oct(14));
  assert.equal(a.days3, day(4));
  assert.equal(a.days7, null);
});

test('дата по первой серии, срыв не забирает', () => {
  const a = get(oct(1), [oct(9)], oct(16));
  assert.equal(a.days7, day(8));
});

test('пятница засчитывается, когда прошла', () => {
  assert.equal(get(oct(12), [], oct(16, 23)).friday, null);
  assert.equal(get(oct(12), [], oct(17, 0)).friday, day(16));
});

test('трезвые пт-вс', () => {
  assert.equal(get(oct(12), [], oct(18, 23)).weekend, null);
  assert.equal(get(oct(12), [], oct(19)).weekend, day(18));
});

test('срыв в субботу переносит выходные на следующую неделю', () => {
  assert.equal(get(oct(12), [oct(17)], oct(26)).weekend, day(25));
});

test('старт в субботу: первые выходные не считаются', () => {
  const a = get(oct(17), [], oct(19));
  assert.equal(a.weekend, null);
  assert.equal(a.friday, null);
});

test('итоги дня 7 дней подряд', () => {
  const dates = [3, 1, 2, 4, 5, 6, 7].map(day);
  assert.equal(get(oct(1), [], oct(14), dates).reviews7, day(7));
});

test('пропуск в итогах дня', () => {
  const dates = [1, 2, 3, 5, 6, 7, 8].map(day);
  assert.equal(get(oct(1), [], oct(14), dates).reviews7, null);
});

test('итоги дня подряд через переход на зимнее время', () => {
  const dates = [22, 23, 24, 25, 26, 27, 28].map(day);
  assert.equal(get(oct(1), [], oct(29), dates).reviews7, day(28));
});

test('вернулся после срыва и продержался 7 дней', () => {
  assert.equal(get(oct(1), [oct(5)], oct(11)).comeback7, null);
  assert.equal(get(oct(1), [oct(5)], oct(12)).comeback7, day(12));
});

test('без срывов восстановления нет', () => {
  assert.equal(get(oct(1), [], oct(31)).comeback7, null);
});

test('сводный пример со спеки: 5 из 13', () => {
  const a = get(oct(1), [], oct(9));
  const done = Object.entries(a).filter(([, d]) => d !== null);
  assert.deepEqual(Object.fromEntries(done), {
    days1: day(2),
    days3: day(4),
    days7: day(8),
    friday: day(2),
    weekend: day(4),
  });
  assert.equal(Object.keys(a).length, 13);
});
