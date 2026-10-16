import type { SQLiteDatabase } from 'expo-sqlite';

// Служебные колонки всех таблиц, кроме settings
const row = `
  id TEXT PRIMARY KEY NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  deletedAt INTEGER`;

// Индекс = номер версии минус 1. Уже выпущенные миграции не меняем, только добавляем новые.
const migrations: string[] = [
  `
  CREATE TABLE habit (${row},
    type TEXT NOT NULL CHECK (type IN ('alcohol')),
    startAt INTEGER NOT NULL,
    weeklySpend INTEGER,
    currency TEXT,
    drinks TEXT NOT NULL DEFAULT '{}'
  );
  CREATE TABLE relapse (${row},
    habitId TEXT NOT NULL,
    at INTEGER NOT NULL,
    mood INTEGER,
    places TEXT,
    hardships TEXT,
    note TEXT
  );
  CREATE TABLE dayReview (${row},
    date TEXT NOT NULL,
    mood INTEGER NOT NULL,
    craving TEXT NOT NULL,
    places TEXT NOT NULL DEFAULT '[]',
    hardships TEXT NOT NULL DEFAULT '[]',
    helpers TEXT NOT NULL DEFAULT '[]',
    note TEXT
  );
  CREATE UNIQUE INDEX dayReview_date ON dayReview(date) WHERE deletedAt IS NULL;
  CREATE TABLE party (${row},
    startAt INTEGER NOT NULL,
    expectedEndAt INTEGER NOT NULL,
    drinkKeys TEXT NOT NULL DEFAULT '[]',
    drinkCustoms TEXT NOT NULL DEFAULT '[]',
    result TEXT CHECK (result IN ('sober', 'drank')),
    relapseId TEXT
  );
  CREATE TABLE reason (${row},
    key TEXT,
    customText TEXT,
    "order" INTEGER NOT NULL,
    CHECK ((key IS NULL) != (customText IS NULL))
  );
  CREATE TABLE reply (${row},
    key TEXT,
    customText TEXT,
    "order" INTEGER NOT NULL,
    CHECK ((key IS NULL) != (customText IS NULL))
  );
  CREATE TABLE settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
  `,
];

// Текущая версия схемы, ее пишет экспорт
export const schemaVersion = migrations.length;

// Восстановление из бэкапа одной транзакцией: схема строится до версии файла,
// fill вставляет его строки, остальные миграции доводят их до текущей версии.
// Любая ошибка откатывает все, включая DROP TABLE
export async function restoreDatabase(
  db: SQLiteDatabase,
  version: number,
  fill: (tx: SQLiteDatabase) => Promise<void>,
) {
  await db.withExclusiveTransactionAsync(async (tx) => {
    const tables = await tx.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    );
    for (const { name } of tables) await tx.execAsync(`DROP TABLE "${name}"`);
    for (const sql of migrations.slice(0, version)) await tx.execAsync(sql);
    await fill(tx);
    for (const sql of migrations.slice(version)) await tx.execAsync(sql);
    await tx.execAsync(`PRAGMA user_version = ${migrations.length}`);
  });
}

// onInit для SQLiteProvider: применяет миграции новее user_version, каждую в своей транзакции
export async function migrate(db: SQLiteDatabase) {
  const { user_version } = (await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  ))!;
  for (const [i, sql] of migrations.slice(user_version).entries()) {
    await db.withExclusiveTransactionAsync(async (tx) => {
      await tx.execAsync(sql);
      await tx.execAsync(`PRAGMA user_version = ${user_version + i + 1}`);
    });
  }
}
