import assert from 'node:assert/strict';
import { z } from 'zod';

import { insertRow, softDelete, updateRow } from './rows';
import { rowSchema } from './schema';

const schema = rowSchema.extend({
  at: z.number(),
  places: z.array(z.string()),
  order: z.number(),
  note: z.string().nullable(),
});

function fakeDb() {
  const calls: { sql: string; params: unknown }[] = [];
  const db = {
    runAsync: (sql: string, ...params: unknown[]) => {
      calls.push({ sql: sql.replace(/\s+/g, ' '), params: params[0] });
      return Promise.resolve({ lastInsertRowId: 0, changes: 1 });
    },
  };
  return { db, calls };
}

test('insertRow: служебные поля, JSON-колонки текстом, лишние ключи отброшены', async () => {
  const { db, calls } = fakeDb();
  const data = { at: 5, places: ['bar'], order: 0, note: null, extra: 1 };
  const id = await insertRow(db, 't', schema, data);
  const [call] = calls;
  assert.ok(call);
  assert.equal(
    call.sql,
    'INSERT INTO t ("id", "createdAt", "updatedAt", "deletedAt", "at", "places", "order", "note") VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  );
  assert.ok(Array.isArray(call.params));
  assert.equal(call.params[0], id);
  assert.equal(call.params[3], null);
  assert.deepEqual(call.params.slice(4), [5, '["bar"]', 0, null]);
});

test('updateRow: только переданные колонки и updatedAt', async () => {
  const { db, calls } = fakeDb();
  await updateRow(db, 't', schema, 'x', { places: [] });
  const [call] = calls;
  assert.ok(call && Array.isArray(call.params));
  assert.equal(
    call.sql,
    'UPDATE t SET "places" = ?, "updatedAt" = ? WHERE id = ?',
  );
  assert.equal(call.params[0], '[]');
  assert.equal(call.params[2], 'x');
});

test('softDelete: deletedAt и updatedAt одним временем', async () => {
  const { db, calls } = fakeDb();
  await softDelete(db, 't', 'x');
  const [call] = calls;
  assert.ok(call && Array.isArray(call.params));
  assert.equal(call.params[0], call.params[1]);
  assert.equal(call.params[2], 'x');
});
