import type { SQLiteDatabase } from 'expo-sqlite';

import type { Craving, Hardship, Helper, Mood, Place } from '@/shared/config';
import { newRow } from '@/shared/db';

import type { Checkin } from '../model/types';

// Неудаленный чек-ин за день YYYY-MM-DD или null
export const getCheckin = (db: SQLiteDatabase, date: string) =>
  db.getFirstAsync<Checkin>(
    'SELECT * FROM checkin WHERE date = ? AND deletedAt IS NULL',
    date,
  );

type CheckinData = {
  date: string;
  mood: Mood;
  craving: Craving;
  places: Place[];
  hardships: Hardship[];
  helpers: Helper[];
  note: string;
};

// Один чек-ин на день: повторное сохранение перезаписывает ответы, id и createdAt остаются.
// Индекс частичный, поэтому в conflict target повторяем его WHERE
export async function saveCheckin(db: SQLiteDatabase, data: CheckinData) {
  const r = newRow();
  await db.runAsync(
    `INSERT INTO checkin (id, createdAt, updatedAt, date, mood, craving, places, hardships, helpers, note)
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
