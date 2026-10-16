import type { SQLiteBindValue, SQLiteDatabase } from 'expo-sqlite';

import { restoreDatabase } from '@/shared/db';

import type { Backup, Tables } from '../model/format';

// Все таблицы трогает экспорт и импорт целиком, поэтому SQL здесь, а не в сущностях.
// Список таблиц и колонок берем из самой базы: ни отдельного списка, ни имен из файла в SQL
const tableNames = async (db: SQLiteDatabase) =>
  (
    await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    )
  ).map((r) => r.name);

// Все строки всех таблиц, включая мягко удаленные
export async function dumpTables(db: SQLiteDatabase) {
  const tables: Tables = {};
  for (const name of await tableNames(db))
    tables[name] = await db.getAllAsync(`SELECT * FROM "${name}"`);
  return tables;
}

// Заменяет все данные строками файла. Ошибка схемы (NOT NULL, CHECK) откатывает все
export async function importBackup(
  db: SQLiteDatabase,
  { version, tables }: Backup,
) {
  await restoreDatabase(db, version, async (tx) => {
    for (const name of await tableNames(tx)) {
      const columns = (
        await tx.getAllAsync<{ name: string }>(`PRAGMA table_info("${name}")`)
      ).map((c) => c.name);
      const sql = `INSERT INTO "${name}" (${columns.map((c) => `"${c}"`).join(', ')})
        VALUES (${columns.map(() => '?').join(', ')})`;
      for (const row of tables[name] ?? [])
        await tx.runAsync(
          sql,
          columns.map((c) => (row[c] ?? null) as SQLiteBindValue),
        );
    }
  });
}
