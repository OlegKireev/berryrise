/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { APP, backupFileName, parseBackup } from './format.ts';

const file = (over: Record<string, unknown> = {}) =>
  JSON.stringify({
    app: APP,
    schemaVersion: 1,
    exportedAt: 0,
    tables: { habit: [{ id: 'h' }], relapse: [] },
    ...over,
  });

test('backupFileName: локальное время с нулями', () => {
  assert.equal(
    backupFileName(new Date(2026, 0, 2, 3, 4, 5)),
    'berryrise-2026-01-02-03-04-05.json',
  );
  assert.equal(
    backupFileName(new Date(2026, 9, 16, 21, 5, 9)),
    'berryrise-2026-10-16-21-05-09.json',
  );
});

test('parseBackup: корректный файл', () => {
  assert.deepEqual(parseBackup(file(), 1), {
    version: 1,
    tables: { habit: [{ id: 'h' }], relapse: [] },
  });
});

test('parseBackup: старая версия принимается', () => {
  assert.equal(typeof parseBackup(file(), 3), 'object');
});

test('parseBackup: версия новее - tooNew', () => {
  assert.equal(parseBackup(file({ schemaVersion: 2 }), 1), 'tooNew');
});

test('parseBackup: не наш файл - notBackup', () => {
  for (const text of [
    'not json',
    '[]',
    'null',
    file({ app: 'other' }),
    file({ schemaVersion: 0 }),
    file({ schemaVersion: 1.5 }),
    file({ schemaVersion: '1' }),
    file({ tables: [] }),
    file({ tables: { habit: {} } }),
    file({ tables: { habit: [1] } }),
    file({ tables: { habit: [{ id: { nested: true } }] } }),
  ]) {
    assert.equal(parseBackup(text, 1), 'notBackup', text);
  }
});
