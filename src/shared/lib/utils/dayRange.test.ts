import assert from 'node:assert/strict';

import { dayRange } from './dayRange';

const HOUR = 60 * 60 * 1000;

test('dayRange: обычный день - 24 часа с полуночи', () => {
  const { from, to } = dayRange('2026-10-14');
  assert.equal(from, new Date(2026, 9, 14).getTime());
  assert.equal(to - from, 24 * HOUR);
});

test('dayRange: переход на летнее время - 23 часа', () => {
  const { from, to } = dayRange('2026-03-29');
  assert.equal(to - from, 23 * HOUR);
});

test('dayRange: переход на зимнее время - 25 часов', () => {
  const { from, to } = dayRange('2026-10-25');
  assert.equal(to - from, 25 * HOUR);
});
