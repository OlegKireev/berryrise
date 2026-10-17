import type { SQLiteDatabase } from 'expo-sqlite';

import { achievementKeys, type AchievementKey } from '@/entities/habit';
import { getSetting, setSetting } from '@/shared/db';
import { isOneOf, parseList } from '@/shared/lib';

const KEY = 'seenAchievements';

// Показанные медали. null - строки нет, памяти еще не было
export const getSeen = async (
  db: SQLiteDatabase,
): Promise<AchievementKey[] | null> => {
  const value = await getSetting(db, KEY);
  return value === null ? null : parseList(value, isOneOf(achievementKeys));
};

export const saveSeen = (db: SQLiteDatabase, seen: AchievementKey[]) =>
  setSetting(db, KEY, seen);
