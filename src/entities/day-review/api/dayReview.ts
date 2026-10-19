import type { SQLiteDatabase } from 'expo-sqlite';

import type { Craving, Hardship, Helper, Mood } from '@/shared/config';
import { newRow, parseRow, parseRows } from '@/shared/db';

import { dayReviewSchema } from '../model/schema';

// Читаем всегда SELECT * и проверяем строку целиком: сломанные итоги пропускаются везде одинаково
const parse = (rows: unknown[]) =>
  parseRows('dayReview', dayReviewSchema, rows, 'skip');

// Неудаленные итоги за день YYYY-MM-DD или null
export const getDayReview = async (db: SQLiteDatabase, date: string) =>
  parseRow(
    'dayReview',
    dayReviewSchema,
    await db.getFirstAsync(
      'SELECT * FROM dayReview WHERE date = ? AND deletedAt IS NULL',
      date,
    ),
    'skip',
  );

// Даты всех неудаленных итогов дня, для достижений
export const listDayReviewDates = async (db: SQLiteDatabase) =>
  parse(
    await db.getAllAsync('SELECT * FROM dayReview WHERE deletedAt IS NULL'),
  ).map((r) => r.date);

// Неудаленные итоги за дни с fromDate по toDate включительно, YYYY-MM-DD. Для статистики
export const listDayReviewsBetween = async (
  db: SQLiteDatabase,
  fromDate: string,
  toDate: string,
) =>
  parse(
    await db.getAllAsync(
      'SELECT * FROM dayReview WHERE deletedAt IS NULL AND date >= ? AND date <= ?',
      fromDate,
      toDate,
    ),
  );

// Даты итогов, где рядом пили: вечер в компании. Для достижений
export const listCompanyDates = async (db: SQLiteDatabase) =>
  parse(await db.getAllAsync('SELECT * FROM dayReview WHERE deletedAt IS NULL'))
    .filter((r) => r.hardships.includes('othersDrinking'))
    .map((r) => r.date);

// Неудаленные итоги с заметкой, для ленты заметок
export const listDayReviewNotes = async (db: SQLiteDatabase) =>
  parse(
    await db.getAllAsync(
      'SELECT * FROM dayReview WHERE deletedAt IS NULL AND note IS NOT NULL',
    ),
  );

type DayReviewData = {
  date: string;
  mood: Mood;
  craving: Craving;
  hardships: Hardship[];
  helpers: Helper[];
  note: string;
};

// Одни итоги на день: повторное сохранение перезаписывает ответы, id и createdAt остаются.
// Индекс частичный, поэтому в conflict target повторяем его WHERE
export async function saveDayReview(db: SQLiteDatabase, data: DayReviewData) {
  const r = newRow();
  await db.runAsync(
    `INSERT INTO dayReview (id, createdAt, updatedAt, date, mood, craving, hardships, helpers, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) WHERE deletedAt IS NULL DO UPDATE SET
       updatedAt = excluded.updatedAt,
       mood = excluded.mood,
       craving = excluded.craving,
       hardships = excluded.hardships,
       helpers = excluded.helpers,
       note = excluded.note`,
    r.id,
    r.createdAt,
    r.updatedAt,
    data.date,
    data.mood,
    data.craving,
    JSON.stringify(data.hardships),
    JSON.stringify(data.helpers),
    data.note.trim() || null,
  );
}
