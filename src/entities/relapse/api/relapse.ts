import type { SQLiteDatabase } from 'expo-sqlite';

import type { Hardship, Mood, Place } from '@/shared/config';
import { newRow, parseRows } from '@/shared/db';

import { relapseSchema } from '../model/schema';

// Читаем всегда SELECT * и проверяем строку целиком. Сломанный срыв роняет чтение:
// без него стрик тихо соврал бы в хорошую сторону
const parse = (rows: unknown[]) =>
  parseRows('relapse', relapseSchema, rows, 'throw');

// Неудаленные срывы, новые сверху.
// ponytail: привычка одна, поэтому без фильтра по habitId
export const listRelapses = async (db: SQLiteDatabase) =>
  parse(
    await db.getAllAsync(
      'SELECT * FROM relapse WHERE deletedAt IS NULL ORDER BY at DESC',
    ),
  );

// Есть ли неудаленный срыв за [from, to) или записанный в это время (задним числом тоже)
export const hasRelapseBetween = async (
  db: SQLiteDatabase,
  from: number,
  to: number,
) =>
  (await db.getFirstAsync(
    'SELECT 1 FROM relapse WHERE deletedAt IS NULL AND ((at >= ? AND at < ?) OR (createdAt >= ? AND createdAt < ?)) LIMIT 1',
    from,
    to,
    from,
    to,
  )) !== null;

// Неудаленные срывы с разбором с началом в [from, to), ранние сверху
export const listRelapsesBetween = async (
  db: SQLiteDatabase,
  from: number,
  to: number,
) =>
  parse(
    await db.getAllAsync(
      'SELECT * FROM relapse WHERE deletedAt IS NULL AND at >= ? AND at < ? ORDER BY at',
      from,
      to,
    ),
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
