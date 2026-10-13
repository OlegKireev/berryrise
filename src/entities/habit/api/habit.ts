import type { SQLiteDatabase } from 'expo-sqlite';

import { newRow } from '@/shared/db';

import type { Drink, Habit } from '../model/types';

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

export const updateHabitStart = (
  db: SQLiteDatabase,
  id: string,
  startAt: number,
) =>
  db.runAsync(
    'UPDATE habit SET startAt = ?, updatedAt = ? WHERE id = ?',
    startAt,
    Date.now(),
    id,
  );

type Spending = {
  weeklySpend: number | null;
  currency: string;
  drinks: Partial<Record<Drink, number>>;
};

// В drinks пишем только пресеты с порциями, нулевые выкидываем
export const updateSpending = (
  db: SQLiteDatabase,
  id: string,
  { weeklySpend, currency, drinks }: Spending,
) =>
  db.runAsync(
    'UPDATE habit SET weeklySpend = ?, currency = ?, drinks = ?, updatedAt = ? WHERE id = ?',
    weeklySpend,
    currency,
    JSON.stringify(
      Object.fromEntries(Object.entries(drinks).filter(([, n]) => n > 0)),
    ),
    Date.now(),
    id,
  );
