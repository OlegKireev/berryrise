import type { SQLiteDatabase } from 'expo-sqlite';

import type { Craving, Hardship, Helper, Mood, Place } from '@/shared/config';
import { newRow } from '@/shared/db';

import type { DayReview } from '../model/types';

// Неудаленные итоги за день YYYY-MM-DD или null
export const getDayReview = (db: SQLiteDatabase, date: string) =>
  db.getFirstAsync<DayReview>(
    'SELECT * FROM dayReview WHERE date = ? AND deletedAt IS NULL',
    date,
  );

// Даты всех неудаленных итогов дня, для ачивок
export const listDayReviewDates = async (db: SQLiteDatabase) =>
  (
    await db.getAllAsync<Pick<DayReview, 'date'>>(
      'SELECT date FROM dayReview WHERE deletedAt IS NULL',
    )
  ).map((r) => r.date);

// Даты итогов, где в местах есть компания или бар: там обычно пьют. Для ачивок
export const listCompanyDates = async (db: SQLiteDatabase) =>
  (
    await db.getAllAsync<Pick<DayReview, 'date'>>(
      `SELECT date FROM dayReview WHERE deletedAt IS NULL
       AND EXISTS (SELECT 1 FROM json_each(places) WHERE value IN ('company', 'bar'))`,
    )
  ).map((r) => r.date);

type DayReviewData = {
  date: string;
  mood: Mood;
  craving: Craving;
  places: Place[];
  hardships: Hardship[];
  helpers: Helper[];
  note: string;
};

// Одни итоги на день: повторное сохранение перезаписывает ответы, id и createdAt остаются.
// Индекс частичный, поэтому в conflict target повторяем его WHERE
export async function saveDayReview(db: SQLiteDatabase, data: DayReviewData) {
  const r = newRow();
  await db.runAsync(
    `INSERT INTO dayReview (id, createdAt, updatedAt, date, mood, craving, places, hardships, helpers, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) WHERE deletedAt IS NULL DO UPDATE SET
       updatedAt = excluded.updatedAt,
       mood = excluded.mood,
       craving = excluded.craving,
       places = excluded.places,
       hardships = excluded.hardships,
       helpers = excluded.helpers,
       note = excluded.note`,
    r.id,
    r.createdAt,
    r.updatedAt,
    data.date,
    data.mood,
    data.craving,
    JSON.stringify(data.places),
    JSON.stringify(data.hardships),
    JSON.stringify(data.helpers),
    data.note.trim() || null,
  );
}
