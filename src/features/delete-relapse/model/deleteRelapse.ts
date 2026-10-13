import type { SQLiteDatabase } from 'expo-sqlite';

// Срыв удаляется мягко, вечеринка, из которой он появился, снова становится "без ответа".
// Трогает две сущности (relapse и party), поэтому это фича, а не api сущности.
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
