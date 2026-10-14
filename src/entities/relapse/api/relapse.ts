import type { SQLiteDatabase } from 'expo-sqlite';

import type { Hardship, Mood, Place } from '@/shared/config';
import { newRow } from '@/shared/db';

import type { Relapse } from '../model/types';

// Неудаленные срывы, новые сверху.
// ponytail: привычка одна, поэтому без фильтра по habitId
export const listRelapses = (db: SQLiteDatabase) =>
  db.getAllAsync<Pick<Relapse, 'id' | 'at'>>(
    'SELECT id, at FROM relapse WHERE deletedAt IS NULL ORDER BY at DESC',
  );

type NewRelapse = {
  habitId: string;
  at: number;
  mood: Mood | null;
  places: Place[];
  hardships: Hardship[];
  note: string;
};

// Пустой разбор пишем как NULL, а не как "[]" и "". Возвращает id срыва
export async function insertRelapse(db: SQLiteDatabase, data: NewRelapse) {
  const r = newRow();
  await db.runAsync(
    `INSERT INTO relapse (id, createdAt, updatedAt, habitId, at, mood, places, hardships, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    r.id,
    r.createdAt,
    r.updatedAt,
    data.habitId,
    data.at,
    data.mood,
    data.places.length ? JSON.stringify(data.places) : null,
    data.hardships.length ? JSON.stringify(data.hardships) : null,
    data.note.trim() || null,
  );
  return r.id;
}
