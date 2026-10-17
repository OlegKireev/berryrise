import type { SQLiteDatabase } from 'expo-sqlite';

import { newRow, parseRow, parseRows } from '@/shared/db';
import { HOUR_MS, isString, parseList } from '@/shared/lib';

import { partySchema, type Party } from '../model/schema';
import type { PartyDrink } from '../model/types';

const DEFAULT_HOURS = 4;

// Идущая вечеринка - неудаленная и без ответа "как прошло?"
const ACTIVE = 'result IS NULL AND deletedAt IS NULL';

// Читаем всегда SELECT * и проверяем строку целиком: сломанная вечеринка пропускается везде одинаково
const parse = (rows: unknown[]) =>
  parseRows('party', partySchema, rows, 'skip');
const parseOne = (row: unknown) => parseRow('party', partySchema, row, 'skip');

export const getActiveParty = async (db: SQLiteDatabase) =>
  parseOne(
    await db.getFirstAsync(
      `SELECT * FROM party WHERE ${ACTIVE} ORDER BY startAt DESC LIMIT 1`,
    ),
  );

export const getParty = async (db: SQLiteDatabase, id: string) =>
  parseOne(await db.getFirstAsync('SELECT * FROM party WHERE id = ?', id));

// Идущая вечеринка или новая с концом через 4 часа и напитком из прошлой.
// Проверка и вставка в одной транзакции: эффект в dev может отработать дважды,
// и без нее получились бы две вечеринки
export async function startParty(db: SQLiteDatabase): Promise<Party> {
  // объект, а не let: присваивание внутри колбэка TS видит только у свойства
  const result: { party?: Party } = {};
  await db.withExclusiveTransactionAsync(async (tx) => {
    result.party = (await getActiveParty(tx)) ?? undefined;

    if (result.party) {
      return;
    }

    const last = parseOne(
      await tx.getFirstAsync(
        'SELECT * FROM party WHERE deletedAt IS NULL ORDER BY startAt DESC LIMIT 1',
      ),
    );
    const r = newRow();
    const party: Party = {
      ...r,
      startAt: r.createdAt,
      expectedEndAt: r.createdAt + DEFAULT_HOURS * HOUR_MS,
      drinkKeys: last?.drinkKeys ?? [],
      drinkCustoms: last?.drinkCustoms ?? [],
      result: null,
      relapseId: null,
    };
    await tx.runAsync(
      'INSERT INTO party (id, createdAt, updatedAt, startAt, expectedEndAt, drinkKeys, drinkCustoms) VALUES (?, ?, ?, ?, ?, ?, ?)',
      r.id,
      r.createdAt,
      r.updatedAt,
      party.startAt,
      party.expectedEndAt,
      JSON.stringify(party.drinkKeys),
      JSON.stringify(party.drinkCustoms),
    );
    result.party = party;
  });

  if (!result.party) {
    throw new Error('startParty: вечеринка не создана');
  }

  return result.party;
}

const update = (
  db: SQLiteDatabase,
  id: string,
  set: string,
  ...args: (string | number | null)[]
) =>
  db.runAsync(
    `UPDATE party SET ${set}, updatedAt = ? WHERE id = ?`,
    ...args,
    Date.now(),
    id,
  );

export const setPartyEnd = (db: SQLiteDatabase, id: string, at: number) =>
  update(db, id, 'expectedEndAt = ?', at);

// Все выбранные напитки вечеринки целиком: готовые ключами, свои текстом
export const setPartyDrinks = (
  db: SQLiteDatabase,
  id: string,
  keys: PartyDrink[],
  customs: string[],
) =>
  update(
    db,
    id,
    'drinkKeys = ?, drinkCustoms = ?',
    JSON.stringify(keys),
    JSON.stringify(customs),
  );

export const setPartyResult = (
  db: SQLiteDatabase,
  id: string,
  result: 'sober' | 'drank',
  relapseId: string | null = null,
) => update(db, id, 'result = ?, relapseId = ?', result, relapseId);

// "Не пошел": вечеринку удаляем, в достижения она не идет
export const cancelParty = (db: SQLiteDatabase, id: string) =>
  update(db, id, 'deletedAt = ?', Date.now());

// Была ли неудаленная вечеринка с началом в [from, to)
export const hasPartyOn = async (
  db: SQLiteDatabase,
  from: number,
  to: number,
) =>
  !!(await db.getFirstAsync(
    'SELECT 1 FROM party WHERE deletedAt IS NULL AND startAt >= ? AND startAt < ?',
    from,
    to,
  ));

// Последняя неудаленная вечеринка с началом в [from, to), для карточки дня
export const getPartyOn = async (
  db: SQLiteDatabase,
  from: number,
  to: number,
) =>
  parseOne(
    await db.getFirstAsync(
      'SELECT * FROM party WHERE deletedAt IS NULL AND startAt >= ? AND startAt < ? ORDER BY startAt DESC LIMIT 1',
      from,
      to,
    ),
  );

// Начала вечеринок с ответом "без алкоголя", для достижений
export const listSoberPartyStarts = async (db: SQLiteDatabase) =>
  parse(
    await db.getAllAsync(
      "SELECT * FROM party WHERE deletedAt IS NULL AND result = 'sober'",
    ),
  ).map((p) => p.startAt);

// Ответы неудаленных вечеринок с ответом и началом в [from, to), для статистики
export const listPartyResultsBetween = async (
  db: SQLiteDatabase,
  from: number,
  to: number,
) =>
  parse(
    await db.getAllAsync(
      'SELECT * FROM party WHERE deletedAt IS NULL AND result IS NOT NULL AND startAt >= ? AND startAt < ?',
      from,
      to,
    ),
  ).flatMap((p) => (p.result ? [p.result] : []));

// Начала неудаленных вечеринок с from, для расписания уведомлений
export const listPartyStartsSince = async (db: SQLiteDatabase, from: number) =>
  parse(
    await db.getAllAsync(
      'SELECT * FROM party WHERE deletedAt IS NULL AND startAt >= ?',
      from,
    ),
  ).map((p) => p.startAt);

// Свои напитки - общий список для всех вечеринок, в settings одним JSON-массивом.
// ponytail: список целиком в одной строке, отдельная таблица понадобится, если появится синхронизация
const CUSTOM_DRINKS = 'customPartyDrinks';

export const listCustomDrinks = async (db: SQLiteDatabase) => {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    CUSTOM_DRINKS,
  );
  return parseList(row?.value ?? null, isString);
};

const saveCustomDrinks = (db: SQLiteDatabase, list: string[]) =>
  db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    CUSTOM_DRINKS,
    JSON.stringify(list),
  );

export async function addCustomDrink(db: SQLiteDatabase, name: string) {
  const list = await listCustomDrinks(db);

  if (!list.includes(name)) {
    await saveCustomDrinks(db, [...list, name]);
  }
}

export const deleteCustomDrink = async (db: SQLiteDatabase, name: string) =>
  saveCustomDrinks(
    db,
    (await listCustomDrinks(db)).filter((d) => d !== name),
  );
