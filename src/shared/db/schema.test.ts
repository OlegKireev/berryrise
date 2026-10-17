import assert from 'node:assert/strict';
import { z } from 'zod';

import {
  jsonCounts,
  jsonList,
  optional,
  parseRow,
  parseRows,
  rowSchema,
} from './schema';

const keys = ['home', 'work'] as const;

const schema = rowSchema.extend({
  at: z.number(),
  mood: optional(z.literal([1, 2, 3]), 'mood'),
  places: jsonList(z.enum(keys), 'places'),
  drinks: jsonCounts(['beer', 'wine'], 'drinks'),
});

const row = {
  id: 'a',
  createdAt: 1,
  updatedAt: 1,
  deletedAt: null,
  at: 10,
  mood: 2,
  places: '["home"]',
  drinks: '{"beer":3}',
};

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('строка без отклонений читается как есть, JSON разобран', () => {
  assert.deepEqual(parseRows('t', schema, [row], 'throw'), [
    { ...row, places: ['home'], drinks: { beer: 3 } },
  ]);
});

test('неизвестные варианты не валят строку', () => {
  const [r] = parseRows(
    't',
    schema,
    [
      {
        ...row,
        mood: 9,
        places: '["home","bar"]',
        drinks: '{"beer":3,"rum":1}',
      },
    ],
    'throw',
  );

  assert.ok(r);
  assert.equal(r.mood, null);
  assert.deepEqual(r.places, ['home']);
  assert.deepEqual(r.drinks, { beer: 3 });
});

test('NULL и битый JSON в колонке списка - пустой список', () => {
  const rows = parseRows(
    't',
    schema,
    [
      { ...row, places: null },
      { ...row, places: '[oops' },
    ],
    'throw',
  );

  assert.deepEqual(
    rows.map((r) => r.places),
    [[], []],
  );
});

test('сломанный скелет: skip пропускает строку, throw бросает', () => {
  const broken = { ...row, id: 'b', at: 'вчера' };

  assert.deepEqual(
    parseRows('t', schema, [broken, row], 'skip').map((r) => r.id),
    ['a'],
  );
  assert.throws(() => parseRows('t', schema, [broken], 'throw'), /t b: .*at/);
});

test('parseRow: null остается null, пропущенная строка - null', () => {
  assert.equal(parseRow('t', schema, null, 'throw'), null);
  assert.equal(parseRow('t', schema, { ...row, at: null }, 'skip'), null);
  assert.equal(parseRow('t', schema, row, 'skip')?.id, 'a');
});
