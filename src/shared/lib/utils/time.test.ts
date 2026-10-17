import assert from 'node:assert/strict';

import { minutesOfDay, timeOfDay, weekdayFromMonday } from './time';

test('weekdayFromMonday: понедельник 0, воскресенье 6', () => {
  assert.equal(weekdayFromMonday(new Date(2026, 9, 12)), 0);
  assert.equal(weekdayFromMonday(new Date(2026, 9, 18)), 6);
});

test('timeOfDay и minutesOfDay обратны друг другу', () => {
  const d = timeOfDay(21 * 60 + 30);
  assert.equal(d.getHours(), 21);
  assert.equal(d.getMinutes(), 30);
  assert.equal(minutesOfDay(d), 21 * 60 + 30);
});
