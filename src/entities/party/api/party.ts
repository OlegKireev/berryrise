import type { SQLiteDatabase } from 'expo-sqlite';

import { newRow } from '@/shared/db';

import type { Party, PartyDrink } from '../model/types';

const HOUR = 60 * 60 * 1000;
const DEFAULT_LENGTH = 4 * HOUR;

// Идущая вечеринка - неудаленная и без ответа "как прошло?"
const ACTIVE = 'result IS NULL AND deletedAt IS NULL';

export const getActiveParty = (db: SQLiteDatabase) =>
  db.getFirstAsync<Party>(
    `SELECT * FROM party WHERE ${ACTIVE} ORDER BY startAt DESC LIMIT 1`,
  );

export const getParty = (db: SQLiteDatabase, id: string) =>
  db.getFirstAsync<Party>('SELECT * FROM party WHERE id = ?', id);

// Идущая вечеринка или новая с концом через 4 часа и напитком из прошлой.
// Проверка и вставка в одной транзакции: эффект в dev может отработать дважды,
// и без нее получились бы две вечеринки
export async function startParty(db: SQLiteDatabase): Promise<Party> {
  let party: Party | null = null;
  await db.withExclusiveTransactionAsync(async (tx) => {
    party = await getActiveParty(tx);
    if (party) return;
    const last = await tx.getFirstAsync<
      Pick<Party, 'drinkKeys' | 'drinkCustoms'>
    >(
      'SELECT drinkKeys, drinkCustoms FROM party WHERE deletedAt IS NULL ORDER BY startAt DESC LIMIT 1',
    );
    const r = newRow();
    party = {
      ...r,
      startAt: r.createdAt,
      expectedEndAt: r.createdAt + DEFAULT_LENGTH,
      drinkKeys: last?.drinkKeys ?? '[]',
      drinkCustoms: last?.drinkCustoms ?? '[]',
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
      party.drinkKeys,
      party.drinkCustoms,
    );
  });
  return party!;
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

// "Не пошел": вечеринку удаляем, в ачивки она не идет
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

// Начала вечеринок с ответом "без алкоголя", для ачивок
export const listSoberPartyStarts = async (db: SQLiteDatabase) =>
  (
    await db.getAllAsync<Pick<Party, 'startAt'>>(
      "SELECT startAt FROM party WHERE deletedAt IS NULL AND result = 'sober'",
    )
  ).map((p) => p.startAt);

// Начала неудаленных вечеринок с from, для расписания уведомлений
export const listPartyStartsSince = async (db: SQLiteDatabase, from: number) =>
  (
    await db.getAllAsync<Pick<Party, 'startAt'>>(
      'SELECT startAt FROM party WHERE deletedAt IS NULL AND startAt >= ?',
      from,
    )
  ).map((p) => p.startAt);

// Свои напитки - общий список для всех вечеринок, в settings одним JSON-массивом.
// ponytail: список целиком в одной строке, отдельная таблица понадобится, если появится синхронизация
const CUSTOM_DRINKS = 'customPartyDrinks';

export const listCustomDrinks = async (db: SQLiteDatabase) => {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    CUSTOM_DRINKS,
  );
  return row ? (JSON.parse(row.value) as string[]) : [];
};

const saveCustomDrinks = (db: SQLiteDatabase, list: string[]) =>
  db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    CUSTOM_DRINKS,
    JSON.stringify(list),
  );

export async function addCustomDrink(db: SQLiteDatabase, name: string) {
  const list = await listCustomDrinks(db);
  if (!list.includes(name)) await saveCustomDrinks(db, [...list, name]);
}

export const deleteCustomDrink = async (db: SQLiteDatabase, name: string) =>
  saveCustomDrinks(
    db,
    (await listCustomDrinks(db)).filter((d) => d !== name),
  );
