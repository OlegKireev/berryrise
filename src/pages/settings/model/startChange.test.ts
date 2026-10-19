import assert from 'node:assert/strict';

import { startChange } from './startChange';

test('startChange: старт раньше - ничего не теряется', () => {
  assert.equal(
    startChange(
      { current: 10, got: { days7: '2026-10-08' } },
      { current: 15, got: { days7: '2026-10-03' } },
    ),
    null,
  );
});

test('startChange: старт позже без срывов - стрик и медали', () => {
  assert.deepEqual(
    startChange(
      { current: 40, got: { days30: '2026-10-01' } },
      { current: 12, got: {} },
    ),
    { streak: { from: 40, to: 12 }, medalsLost: true },
  );
});

test('startChange: старт позже при срывах - текущий стрик тот же, пропали медали', () => {
  assert.deepEqual(
    startChange(
      { current: 5, got: { days7: '2026-09-08' } },
      { current: 5, got: {} },
    ),
    { streak: undefined, medalsLost: true },
  );
});

test('startChange: старт позже, но потерь нет', () => {
  assert.equal(
    startChange({ current: 20, got: {} }, { current: 20, got: {} }),
    null,
  );
});
