/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { toggle, toggleExclusive } from './toggle.ts';

test('toggle добавляет, убирает и не дублирует', () => {
  assert.deepEqual(toggle(['a'], 'b'), ['a', 'b']);
  assert.deepEqual(toggle(['a', 'b'], 'a'), ['b']);
  assert.deepEqual(toggle(['a'], 'a', true), ['a']);
  assert.deepEqual(toggle(['a'], 'b', false), ['a']);
});

test('toggleExclusive: "ничего" и остальные взаимно исключаются', () => {
  assert.deepEqual(toggleExclusive(['a', 'b'], 'none', 'none'), ['none']);
  assert.deepEqual(toggleExclusive(['none'], 'none', 'none'), []);
  assert.deepEqual(toggleExclusive(['none'], 'a', 'none'), ['a']);
});
