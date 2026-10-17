import assert from 'node:assert/strict';

import { addDays } from './addDays';

test('addDays: через границы месяца и года', () => {
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
});

test('addDays: через переходы на летнее и зимнее время', () => {
  assert.equal(addDays('2026-03-29', 1), '2026-03-30');
  assert.equal(addDays('2026-10-25', 1), '2026-10-26');
  assert.equal(addDays('2026-10-26', -1), '2026-10-25');
});
