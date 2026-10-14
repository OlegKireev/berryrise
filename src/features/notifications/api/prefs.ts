import type { SQLiteDatabase } from 'expo-sqlite';

import { defaultPrefs, type NotificationPrefs } from '../model/types';

const KEY = 'notifications';

// Нет строки - ничего не включали. Поверх значений по умолчанию: вид, добавленный
// позже, у старых данных просто выключен
export const getPrefs = async (
  db: SQLiteDatabase,
): Promise<NotificationPrefs> => {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    KEY,
  );
  return { ...defaultPrefs, ...(row ? JSON.parse(row.value) : {}) };
};

export const savePrefs = (db: SQLiteDatabase, prefs: NotificationPrefs) =>
  db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    KEY,
    JSON.stringify(prefs),
  );
