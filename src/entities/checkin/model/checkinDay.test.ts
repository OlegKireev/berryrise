/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { checkinDay, toDay } from './checkinDay.ts';

// Месяц с нуля, как в Date: oct(14, 9, 30) = 14 октября, 09:30 по местному времени
const oct = (d: number, h = 12, min = 0) =>
  new Date(2026, 9, d, h, min).getTime();

test('утром чек-ин за вчера', () => {
  assert.equal(checkinDay(oct(14, 9, 30)), '2026-10-13');
});

test('в 17:59 еще за вчера', () => {
  assert.equal(checkinDay(oct(14, 17, 59)), '2026-10-13');
});

test('ровно в 18:00 уже за сегодня', () => {
  assert.equal(checkinDay(oct(14, 18)), '2026-10-14');
});

test('после полуночи за вчера', () => {
  assert.equal(checkinDay(oct(15, 0, 40)), '2026-10-14');
});

test('утро после перехода на летнее время', () => {
  // В Берлине 29 марта 2026 в 02:00 часы переводят на 03:00
  assert.equal(
    checkinDay(new Date(2026, 2, 29, 3, 30).getTime()),
    '2026-03-28',
  );
  assert.equal(
    checkinDay(new Date(2026, 2, 30, 0, 30).getTime()),
    '2026-03-29',
  );
});

test('toDay дополняет нулями', () => {
  assert.equal(toDay(new Date(2026, 0, 5, 23, 59).getTime()), '2026-01-05');
});
