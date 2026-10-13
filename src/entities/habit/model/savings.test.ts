/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { drinkKcal, savings } from './savings.ts';

test('700 в неделю за 14 трезвых дней - 1400', () => {
  assert.equal(savings(14, 700, {}).money, 1400);
});

test('округление вниз: 1000 в неделю за 1 день - 142', () => {
  assert.equal(savings(1, 1000, {}).money, 142);
});

test('пиво 7 в неделю за 2 дня - 2 порции', () => {
  const s = savings(2, null, { beer: 7 });
  assert.equal(s.portions, 2);
  assert.equal(s.kcal, 2 * drinkKcal.beer);
});

test('несколько пресетов складываются до округления', () => {
  // (3 + 4) порции в неделю за 1 день = 1, а не 0 + 0
  assert.equal(savings(1, null, { beer: 3, shot: 4 }).portions, 1);
});

test('сумма не указана - денег нет', () => {
  assert.equal(savings(10, null, { beer: 7 }).money, null);
});

test('пустые пресеты - нули', () => {
  assert.deepEqual(savings(10, 700, {}), { money: 1000, portions: 0, kcal: 0 });
});
