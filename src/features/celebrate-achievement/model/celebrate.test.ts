/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import type {
  AchievementKey,
  Got,
} from '../../../entities/habit/model/achievements.ts';
import { celebrate } from './celebrate.ts';

const gotOf = (keys: AchievementKey[]): Got =>
  Object.fromEntries(keys.map((k) => [k, '2026-10-10']));

test('celebrate: первый запуск - все полученные молча в показанные', () => {
  const r = celebrate(gotOf(['days1', 'days3', 'friday']), null, false);
  assert.deepEqual(r, { show: [], seen: ['days1', 'days3', 'friday'] });
});

test('celebrate: новая медаль празднуется и запоминается', () => {
  const r = celebrate(
    gotOf(['days1', 'days3', 'days7']),
    ['days1', 'days3'],
    false,
  );
  assert.deepEqual(r, { show: ['days7'], seen: ['days1', 'days3', 'days7'] });
});

test('celebrate: ничего нового', () => {
  const r = celebrate(gotOf(['days1']), ['days1'], false);
  assert.deepEqual(r.show, []);
});

test('celebrate: в день срыва откладываем, завтра празднуем', () => {
  const got = gotOf(['days1', 'reviews7']);
  const today = celebrate(got, ['days1'], true);
  assert.deepEqual(today, { show: [], seen: ['days1'] });
  const tomorrow = celebrate(got, today.seen, false);
  assert.deepEqual(tomorrow.show, ['reviews7']);
});

test('celebrate: ошибочный срыв удален в тот же день - праздника нет', () => {
  // срыв забрал days30, проверка в день срыва его не забывает
  const during = celebrate(
    gotOf(['days1', 'days7']),
    ['days1', 'days7', 'days30'],
    true,
  );
  // срыв удален, days30 вернулась
  const after = celebrate(
    gotOf(['days1', 'days7', 'days30']),
    during.seen,
    false,
  );
  assert.deepEqual(after.show, []);
});

test('celebrate: медаль пропала и вернулась - празднуем снова', () => {
  const lost = celebrate(
    gotOf(['days1', 'days3']),
    ['days1', 'days3', 'days7'],
    false,
  );
  assert.deepEqual(lost, { show: [], seen: ['days1', 'days3'] });
  const back = celebrate(gotOf(['days1', 'days3', 'days7']), lost.seen, false);
  assert.deepEqual(back.show, ['days7']);
});

test('celebrate: несколько сразу - в общем порядке', () => {
  const r = celebrate(gotOf(['days14', 'weekend', 'days7']), ['days7'], false);
  assert.deepEqual(r.show, ['days14', 'weekend']);
});
