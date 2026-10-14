import type { SQLiteDatabase } from 'expo-sqlite';

import { setPartyResult } from '@/entities/party';
import { insertRelapse } from '@/entities/relapse';

// Срыв на вечеринке: записываем срыв и отмечаем вечеринку "выпил" со ссылкой на него.
// Трогает две сущности, поэтому это фича, а не api сущности
export async function logPartyRelapse(
  db: SQLiteDatabase,
  partyId: string,
  data: Parameters<typeof insertRelapse>[1],
) {
  await db.withExclusiveTransactionAsync(async (tx) => {
    const relapseId = await insertRelapse(tx, data);
    await setPartyResult(tx, partyId, 'drank', relapseId);
  });
}
