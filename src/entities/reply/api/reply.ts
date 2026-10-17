import type { SQLiteDatabase } from 'expo-sqlite';

import { newRow, parseRows } from '@/shared/db';

import { replySchema } from '../model/schema';

// Свои заготовки в порядке добавления, сломанные пропускаются. Готовые живут в коде (replies), в базе их нет
export const listReplies = async (db: SQLiteDatabase) =>
  parseRows(
    'reply',
    replySchema,
    await db.getAllAsync(
      'SELECT * FROM reply WHERE deletedAt IS NULL ORDER BY "order"',
    ),
    'skip',
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
