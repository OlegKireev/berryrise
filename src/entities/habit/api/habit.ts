import type { SQLiteDatabase } from 'expo-sqlite';

import { newRow } from '@/shared/db';

import type { Habit } from '../model/types';

// ponytail: привычка пока одна (алкоголь), берем первую неудаленную
export const getHabit = (db: SQLiteDatabase) =>
  db.getFirstAsync<Habit>(
    'SELECT * FROM habit WHERE deletedAt IS NULL LIMIT 1',
  );

export async function createHabit(db: SQLiteDatabase, startAt: number) {
  const r = newRow();
  await db.runAsync(
    'INSERT INTO habit (id, createdAt, updatedAt, type, startAt) VALUES (?, ?, ?, ?, ?)',
    r.id,
    r.createdAt,
    r.updatedAt,
    'alcohol',
    startAt,
  );
}
