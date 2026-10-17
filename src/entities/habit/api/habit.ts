import type { SQLiteDatabase } from 'expo-sqlite';

import { insertRow, parseRow, updateRow } from '@/shared/db';

import { habitSchema } from '../model/schema';
import type { Drink } from '../model/types';

// ponytail: привычка пока одна (алкоголь), берем первую неудаленную.
// Сломанная строка роняет чтение: без нее стрик и экономия соврали бы
export const getHabit = async (db: SQLiteDatabase) =>
  parseRow(
    'habit',
    habitSchema,
    await db.getFirstAsync(
      'SELECT * FROM habit WHERE deletedAt IS NULL LIMIT 1',
    ),
    'throw',
  );

export async function createHabit(db: SQLiteDatabase, startAt: number) {
  await insertRow(db, 'habit', habitSchema, {
    type: 'alcohol',
    startAt,
    weeklySpend: null,
    currency: null,
    drinks: {},
  });
}

export const updateHabitStart = (
  db: SQLiteDatabase,
  id: string,
  startAt: number,
) => updateRow(db, 'habit', habitSchema, id, { startAt });

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
  updateRow(db, 'habit', habitSchema, id, {
    weeklySpend,
    currency,
    drinks: Object.fromEntries(Object.entries(drinks).filter(([, n]) => n > 0)),
  });
