/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getLocale } from './getLocale.ts';

test('русская локаль в любом регионе', () => {
  for (const l of ['ru', 'ru-RU', 'ru_RU', 'ru-KZ', 'RU-ru'])
    assert.equal(getLocale(l), 'ru');
});

test('остальные локали - английский', () => {
  for (const l of ['en-US', 'de-DE', 'uk-UA', 'run'])
    assert.equal(getLocale(l), 'en');
});

test('без аргумента берет локаль системы', () => {
  assert.ok(['ru', 'en'].includes(getLocale()));
});
