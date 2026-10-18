import assert from 'node:assert/strict';

import { toggle } from './toggle';

test('toggle добавляет, убирает и не дублирует', () => {
  assert.deepEqual(toggle(['a'], 'b'), ['a', 'b']);
  assert.deepEqual(toggle(['a', 'b'], 'a'), ['b']);
  assert.deepEqual(toggle(['a'], 'a', true), ['a']);
  assert.deepEqual(toggle(['a'], 'b', false), ['a']);
});
