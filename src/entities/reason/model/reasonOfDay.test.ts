import assert from 'node:assert/strict';

import { reasonOfDay } from './reasonOfDay';

test('без причин - null', () => {
  assert.equal(reasonOfDay([], '2026-10-13'), null);
});

test('одна причина каждый день', () => {
  assert.equal(reasonOfDay(['health'], '2026-10-13'), 'health');
  assert.equal(reasonOfDay(['health'], '2026-10-14'), 'health');
});

test('соседние дни - следующая причина, по кругу', () => {
  const list = ['health', 'sleep', 'money'];
  const days = ['2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16'];
  const got = days.map((d) => reasonOfDay(list, d));
  assert.ok(got[0]);
  const i = list.indexOf(got[0]);
  assert.deepEqual(
    got,
    [0, 1, 2, 3].map((k) => list[(i + k) % 3]),
  );
});

test('через смену месяца и года подряд', () => {
  const list = ['a', 'b'];
  assert.notEqual(
    reasonOfDay(list, '2026-12-31'),
    reasonOfDay(list, '2027-01-01'),
  );
});
