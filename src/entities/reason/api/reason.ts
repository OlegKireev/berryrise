import type { SQLiteDatabase } from 'expo-sqlite';

import { getSetting, newRow, parseRows, setSetting } from '@/shared/db';
import { isString, parseList } from '@/shared/lib';

import { reasonSchema } from '../model/schema';
import type { Reason } from '../model/types';

// Неудаленные причины в порядке добавления, сломанные пропускаются
export const listReasons = async (db: SQLiteDatabase) =>
  parseRows(
    'reason',
    reasonSchema,
    await db.getAllAsync(
      'SELECT * FROM reason WHERE deletedAt IS NULL ORDER BY "order"',
    ),
    'skip',
  );

// Готовая причина или своя, текст своей уже без лишних пробелов
export type NewReason = { key: Reason } | { customText: string };

// В конец списка. order считаем и по удаленным, чтобы не повторялся
export async function addReason(db: SQLiteDatabase, item: NewReason) {
  const r = newRow();
  await db.runAsync(
    'INSERT INTO reason (id, createdAt, updatedAt, key, customText, "order") VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX("order"), -1) + 1 FROM reason))',
    r.id,
    r.createdAt,
    r.updatedAt,
    'key' in item ? item.key : null,
    'customText' in item ? item.customText : null,
  );
}

// Снимает выбор: мягко удаляет активную строку с этим ключом или текстом
export async function deleteReason(db: SQLiteDatabase, item: NewReason) {
  const now = Date.now();
  await db.runAsync(
    `UPDATE reason SET deletedAt = ?, updatedAt = ? WHERE deletedAt IS NULL AND ${'key' in item ? 'key' : 'customText'} = ?`,
    now,
    now,
    'key' in item ? item.key : item.customText,
  );
}

// Свои формулировки, в том числе невыбранные: JSON-массив в settings, как свои напитки
const CUSTOM_REASONS = 'customReasons';

export const listCustomReasons = async (db: SQLiteDatabase) =>
  parseList(await getSetting(db, CUSTOM_REASONS), isString);

export const saveCustomReasons = (db: SQLiteDatabase, list: string[]) =>
  setSetting(db, CUSTOM_REASONS, list);
