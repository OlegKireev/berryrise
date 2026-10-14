import type { SQLiteDatabase } from 'expo-sqlite';

import { newRow } from '@/shared/db';

import type { ReplyRow } from '../model/types';

// Свои заготовки в порядке добавления. Готовые живут в коде (replies), в базе их нет
export const listReplies = (db: SQLiteDatabase) =>
  db.getAllAsync<ReplyRow>(
    'SELECT * FROM reply WHERE deletedAt IS NULL ORDER BY "order"',
  );

// В конец списка. order считаем и по удаленным, чтобы не повторялся
export async function addReply(db: SQLiteDatabase, customText: string) {
  const r = newRow();
  await db.runAsync(
    `INSERT INTO reply (id, createdAt, updatedAt, customText, "order")
     VALUES (?, ?, ?, ?, (SELECT COALESCE(MAX("order"), -1) + 1 FROM reply))`,
    r.id,
    r.createdAt,
    r.updatedAt,
    customText,
  );
}

export async function deleteReply(db: SQLiteDatabase, id: string) {
  const now = Date.now();
  await db.runAsync(
    'UPDATE reply SET deletedAt = ?, updatedAt = ? WHERE id = ?',
    now,
    now,
    id,
  );
}
