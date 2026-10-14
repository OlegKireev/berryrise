/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { toDay } from './toDay.ts';

test('toDay дополняет нулями', () => {
  assert.equal(toDay(new Date(2026, 0, 5, 23, 59).getTime()), '2026-01-05');
});
