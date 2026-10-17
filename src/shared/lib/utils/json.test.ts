/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  isOneOf,
  isString,
  parseCounts,
  parseJson,
  parseList,
} from './json.ts';

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

test('parseCounts: известные ключи с числами', () => {
  assert.deepEqual(
    parseCounts('{"beer": 3, "wine": "2", "tea": 1}', ['beer', 'wine']),
    { beer: 3 },
  );
  assert.deepEqual(parseCounts('[1]', ['beer']), {});
});
