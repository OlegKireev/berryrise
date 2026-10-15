/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  achievementKeys,
  type AchievementKey,
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
  assert.deepEqual(pickMedals(got), ['days7', 'weekend', 'days3']);
});

test('pickMedals: ничего не получено - первые три по порядку', () => {
  assert.deepEqual(pickMedals(none()), ['days1', 'days3', 'days7']);
});

test('pickMedals: одна полученная и две следующие', () => {
  assert.deepEqual(pickMedals({ ...none(), days1: '2026-10-02' }), [
    'days1',
    'days3',
    'days7',
  ]);
});
