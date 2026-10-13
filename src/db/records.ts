import { randomUUID } from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import type { Row } from './types';

// Служебные поля новой записи
export function newRow(): Row {
  const now = Date.now();
  return { id: randomUUID(), createdAt: now, updatedAt: now, deletedAt: null };
}

// Срыв удаляется мягко, вечеринка, из которой он появился, снова становится "без ответа"
export async function deleteRelapse(db: SQLiteDatabase, id: string) {
  const now = Date.now();
  await db.withExclusiveTransactionAsync(async (tx) => {
    await tx.runAsync(
      'UPDATE relapse SET deletedAt = ?, updatedAt = ? WHERE id = ?',
      now,
      now,
      id,
    );
    await tx.runAsync(
      'UPDATE party SET result = NULL, relapseId = NULL, updatedAt = ? WHERE relapseId = ?',
      now,
      id,
    );
  });
}
