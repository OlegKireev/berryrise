import assert from 'node:assert/strict';

import { at } from './at';

test('at: элемент по индексу, за границей - ошибка', () => {
  assert.equal(at(['a', 'b'], 1), 'b');
  assert.throws(() => at(['a'], 1), RangeError);
  assert.throws(() => at([], 0), RangeError);
});
