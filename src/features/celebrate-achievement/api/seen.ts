import type { SQLiteDatabase } from 'expo-sqlite';

import type { AchievementKey } from '@/entities/habit';

const KEY = 'seenAchievements';

// Показанные медали. null - строки нет, памяти еще не было
export const getSeen = async (
  db: SQLiteDatabase,
): Promise<AchievementKey[] | null> => {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    KEY,
  );
  return row ? JSON.parse(row.value) : null;
};

export const saveSeen = (db: SQLiteDatabase, seen: AchievementKey[]) =>
  db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    KEY,
    JSON.stringify(seen),
  );
