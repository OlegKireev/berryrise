import type { SQLiteDatabase } from 'expo-sqlite';

import { newRow } from '@/shared/db';

import type { Reason, ReasonRow } from '../model/types';

// Неудаленные причины в порядке добавления
export const listReasons = (db: SQLiteDatabase) =>
  db.getAllAsync<ReasonRow>(
    'SELECT * FROM reason WHERE deletedAt IS NULL ORDER BY "order"',
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

export const listCustomReasons = async (db: SQLiteDatabase) => {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    CUSTOM_REASONS,
  );
  return row ? (JSON.parse(row.value) as string[]) : [];
};

export const saveCustomReasons = (db: SQLiteDatabase, list: string[]) =>
  db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    CUSTOM_REASONS,
    JSON.stringify(list),
  );
