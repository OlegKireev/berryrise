/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  achievementKeys,
  type AchievementKey,
  medalStates,
} from '../../../entities/habit/model/achievements.ts';
import { pickMedals } from './medals.ts';

const none = () =>
  Object.fromEntries(achievementKeys.map((k) => [k, null])) as Record<
    AchievementKey,
    string | null
  >;

test('pickMedals: последние полученные, при равной дате дальше в порядке', () => {
  const got = {
    ...none(),
    days1: '2026-10-02',
    days3: '2026-10-04',
    days7: '2026-10-08',
    friday: '2026-10-02',
    weekend: '2026-10-04',
  };
  assert.deepEqual(pickMedals(got, medalStates(got, 8, 0)), [
    'days7',
    'weekend',
    'days3',
  ]);
});

test('pickMedals: ничего не получено - следующие по порядку, скрытые пропускаем', () => {
  assert.deepEqual(pickMedals(none(), medalStates(none(), 0, 0)), [
    'days1',
    'friday',
    'weekend',
  ]);
});

test('pickMedals: одна полученная, следующая в серии и следующая одиночная', () => {
  const got = { ...none(), days1: '2026-10-02' };
  assert.deepEqual(pickMedals(got, medalStates(got, 1, 0)), [
    'days1',
    'days3',
    'friday',
  ]);
});
