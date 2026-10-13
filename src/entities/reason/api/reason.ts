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

// Пачка в одной транзакции, в конец списка. order считаем и по удаленным, чтобы не повторялся
export async function addReasons(db: SQLiteDatabase, items: NewReason[]) {
  await db.withExclusiveTransactionAsync(async (tx) => {
    const { last } = (await tx.getFirstAsync<{ last: number | null }>(
      'SELECT MAX("order") AS last FROM reason',
    ))!;
    for (const [i, item] of items.entries()) {
      const r = newRow();
      await tx.runAsync(
        'INSERT INTO reason (id, createdAt, updatedAt, key, customText, "order") VALUES (?, ?, ?, ?, ?, ?)',
        r.id,
        r.createdAt,
        r.updatedAt,
        'key' in item ? item.key : null,
        'customText' in item ? item.customText : null,
        (last ?? -1) + 1 + i,
      );
    }
  });
}

export const addReason = (db: SQLiteDatabase, item: NewReason) =>
  addReasons(db, [item]);

export async function deleteReason(db: SQLiteDatabase, id: string) {
  const now = Date.now();
  await db.runAsync(
    'UPDATE reason SET deletedAt = ?, updatedAt = ? WHERE id = ?',
    now,
    now,
    id,
  );
}
