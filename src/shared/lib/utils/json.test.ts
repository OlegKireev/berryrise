import assert from 'node:assert/strict';

import { isOneOf, isString, parseJson, parseList } from './json';

test('parseJson: битая строка и null - null', () => {
  assert.equal(parseJson(null), null);
  assert.equal(parseJson('{'), null);
  assert.deepEqual(parseJson('[1]'), [1]);
});

test('parseList: только подходящие элементы, не массив - пусто', () => {
  assert.deepEqual(parseList('["a", 1, "b"]', isString), ['a', 'b']);
  assert.deepEqual(parseList('["beer", "tea"]', isOneOf(['beer', 'wine'])), [
    'beer',
  ]);
  assert.deepEqual(parseList('{"a": 1}', isString), []);
});
