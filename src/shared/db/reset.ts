import type { SQLiteDatabase } from 'expo-sqlite';

// Только для разработки: удаляет все таблицы и сбрасывает версию схемы.
// Схему заново создаст migrate в onInit SQLiteProvider после перезагрузки JS
export async function resetDatabase(db: SQLiteDatabase) {
  const tables = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
  );
  await db.withExclusiveTransactionAsync(async (tx) => {
    for (const { name } of tables) await tx.execAsync(`DROP TABLE "${name}"`);
    await tx.execAsync('PRAGMA user_version = 0');
  });
}
