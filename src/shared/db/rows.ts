// Типовые записи без ручного SQL: колонки берутся из ключей объекта и проверяются схемой строки,
// поэтому параметры не съезжают, а опечатку в колонке ловит tsc. Запросы с подзапросами,
// upsert и условия не по id пишем руками рядом
import type { SQLiteBindValue, SQLiteDatabase } from 'expo-sqlite';
import type { z } from 'zod';

import { isRecord, isString } from '@/shared/lib';

import { newRow, type Row } from './records';

// Записям нужен только runAsync: так хелперы проверяются фейком без базы
type Db = Pick<SQLiteDatabase, 'runAsync'>;

// Колонки строки без служебных: их ставят сами хелперы
type Fields<S extends z.ZodObject> = Omit<z.output<S>, keyof Row>;

// Массивы и объекты (JSON-колонки) пишутся текстом, остальное как есть
const toSql = (v: unknown): SQLiteBindValue =>
  v === null ||
  typeof v === 'string' ||
  typeof v === 'number' ||
  typeof v === 'boolean'
    ? v
    : JSON.stringify(v);

// Только колонки из схемы: лишние ключи (из спреда) в SQL не попадут
const columns = (schema: z.ZodObject, data: object) =>
  Object.entries(data).filter(([k]) => k in schema.shape);

// Новая строка со служебными полями, возвращает ее id
export async function insertRow<S extends z.ZodObject>(
  db: Db,
  table: string,
  schema: S,
  data: Fields<S>,
) {
  const r = newRow();
  const cols = [...Object.entries(r), ...columns(schema, data)];
  await db.runAsync(
    `INSERT INTO ${table} (${cols.map(([k]) => `"${k}"`).join(', ')})
     VALUES (${cols.map(() => '?').join(', ')})`,
    cols.map(([, v]) => toSql(v)),
  );
  return r.id;
}

// Меняет указанные колонки строки по id и ставит updatedAt
export async function updateRow<S extends z.ZodObject>(
  db: Db,
  table: string,
  schema: S,
  id: string,
  data: Partial<Fields<S>>,
) {
  const cols = [...columns(schema, data), ['updatedAt', Date.now()] as const];
  await db.runAsync(
    `UPDATE ${table} SET ${cols.map(([k]) => `"${k}" = ?`).join(', ')} WHERE id = ?`,
    [...cols.map(([, v]) => toSql(v)), id],
  );
}

// Мягкое удаление по id
export async function softDelete(db: Db, table: string, id: string) {
  const now = Date.now();
  await db.runAsync(
    `UPDATE ${table} SET deletedAt = ?, updatedAt = ? WHERE id = ?`,
    [now, now, id],
  );
}

// Значение из settings как есть (JSON-текст), разбирает вызывающий. Нет строки - null
export async function getSetting(db: SQLiteDatabase, key: string) {
  const row: unknown = await db.getFirstAsync(
    'SELECT value FROM settings WHERE key = ?',
    key,
  );
  return isRecord(row) && isString(row.value) ? row.value : null;
}

// Пишет значение в settings JSON-текстом
export const setSetting = (db: Db, key: string, value: unknown) =>
  db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    JSON.stringify(value),
  );
