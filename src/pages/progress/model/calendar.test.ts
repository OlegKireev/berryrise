import assert from 'node:assert/strict';

import { monthIndex, monthWeeks } from './calendar';

test('monthWeeks начинает неделю с понедельника и добивает до полной', () => {
  // Октябрь 2026 начинается в четверг, 31 день
  const weeks = monthWeeks(2026, 9);
  assert.equal(weeks.length, 5);
  assert.deepEqual(weeks[0], [
    null,
    null,
    null,
    '2026-10-01',
    '2026-10-02',
    '2026-10-03',
    '2026-10-04',
  ]);
  assert.deepEqual(weeks[4], [
    '2026-10-26',
    '2026-10-27',
    '2026-10-28',
    '2026-10-29',
    '2026-10-30',
    '2026-10-31',
    null,
  ]);
});

test('monthIndex растет на единицу через границу года', () => {
  assert.equal(
    monthIndex(new Date(2027, 0, 1).getTime()) -
      monthIndex(new Date(2026, 11, 31).getTime()),
    1,
  );
});
