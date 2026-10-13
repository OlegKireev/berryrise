/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { pluralize } from './pluralize.ts';

const ruDays = { one: 'день', few: 'дня', many: 'дней' };
const forms = (
  ns: number[],
  f: Parameters<typeof pluralize>[1],
  l: 'ru' | 'en',
) => ns.map((n) => pluralize(n, f, l));

test('ru: один', () => {
  assert.deepEqual(
    forms([1, 21, 101, 1001], ruDays, 'ru'),
    Array(4).fill('день'),
  );
});

test('ru: несколько', () => {
  assert.deepEqual(
    forms([2, 3, 4, 22, 34, 102], ruDays, 'ru'),
    Array(6).fill('дня'),
  );
});

test('ru: много, включая 11-14', () => {
  assert.deepEqual(
    forms([0, 5, 11, 12, 14, 20, 111, 112], ruDays, 'ru'),
    Array(8).fill('дней'),
  );
});

test('ru: без few берется many', () => {
  assert.equal(pluralize(3, { one: 'раз', many: 'раз' }, 'ru'), 'раз');
});

test('en: только 1 в единственном числе', () => {
  assert.deepEqual(forms([1, 0, 2, 21], { one: 'day', many: 'days' }, 'en'), [
    'day',
    'days',
    'days',
    'days',
  ]);
});
