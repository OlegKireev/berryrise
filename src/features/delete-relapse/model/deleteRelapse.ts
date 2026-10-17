import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

import { softDelete } from '@/shared/db';

// Срыв удаляется мягко, вечеринка, из которой он появился, снова становится "без ответа".
// Трогает две сущности (relapse и party), поэтому это фича, а не api сущности.
async function deleteRelapse(db: SQLiteDatabase, id: string) {
  const now = Date.now();
  await db.withExclusiveTransactionAsync(async (tx) => {
    await softDelete(tx, 'relapse', id);
    await tx.runAsync(
      'UPDATE party SET result = NULL, relapseId = NULL, updatedAt = ? WHERE relapseId = ?',
      now,
      id,
    );
  });
}

export function useDeleteRelapse() {
  const db = useSQLiteContext();
  return (id: string) => deleteRelapse(db, id);
}
