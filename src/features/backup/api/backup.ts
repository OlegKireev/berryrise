import type { SQLiteDatabase } from 'expo-sqlite';

import { dayReviewSchema } from '@/entities/day-review';
import { habitSchema } from '@/entities/habit';
import { partySchema } from '@/entities/party';
import { reasonSchema } from '@/entities/reason';
import { relapseSchema } from '@/entities/relapse';
import { replySchema } from '@/entities/reply';
import { parseRows, restoreDatabase } from '@/shared/db';

import type { Backup, Cell, Tables } from '../model/format';

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

  for (const name of await tableNames(db)) {
    tables[name] = await db.getAllAsync<Record<string, Cell>>(
      `SELECT * FROM "${name}"`,
    );
  }

  return tables;
}

// Схемы строк сущностей по таблицам. Строка файла, которая не прошла бы проверку при чтении
// (сломан скелет), делает файл поврежденным; неизвестные варианты отбросит уже чтение
const schemas = {
  habit: habitSchema,
  relapse: relapseSchema,
  dayReview: dayReviewSchema,
  party: partySchema,
  reason: reasonSchema,
  reply: replySchema,
};

// Все строки, включая удаленные, после миграций до текущей версии
async function checkRows(tx: SQLiteDatabase) {
  for (const [name, schema] of Object.entries(schemas)) {
    parseRows(
      name,
      schema,
      await tx.getAllAsync(`SELECT * FROM "${name}"`),
      'throw',
    );
  }
}

// Заменяет все данные строками файла. Ошибка схемы (NOT NULL, CHECK) или проверки строк откатывает все
export async function importBackup(
  db: SQLiteDatabase,
  { version, tables }: Backup,
) {
  await restoreDatabase(
    db,
    version,
    async (tx) => {
      for (const name of await tableNames(tx)) {
        const columns = (
          await tx.getAllAsync<{ name: string }>(`PRAGMA table_info("${name}")`)
        ).map((c) => c.name);
        const sql = `INSERT INTO "${name}" (${columns.map((c) => `"${c}"`).join(', ')})
        VALUES (${columns.map(() => '?').join(', ')})`;

        for (const row of tables[name] ?? []) {
          await tx.runAsync(
            sql,
            columns.map((c) => row[c] ?? null),
          );
        }
      }
    },
    checkRows,
  );
}
