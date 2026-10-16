// Маркер файла - bundle id: он не меняется, в отличие от названия приложения
export const APP = 'com.berryrise.app';

export type Tables = Record<string, Record<string, unknown>[]>;
export type Backup = { version: number; tables: Tables };

const pad = (n: number) => String(n).padStart(2, '0');

// berryrise-YYYY-MM-DD-HH-mm-SS.json по локальному времени
export function backupFileName(d: Date) {
  const date = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())];
  const time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())];
  return `berryrise-${[...date, ...time].join('-')}.json`;
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

// Проверяет обертку файла. Содержимое записей проверяет схема при вставке
export function parseBackup(
  text: string,
  currentVersion: number,
): Backup | 'notBackup' | 'tooNew' {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return 'notBackup';
  }
  if (!isObject(data) || data.app !== APP) return 'notBackup';
  const { schemaVersion: version, tables } = data;
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 1)
    return 'notBackup';
  if (version > currentVersion) return 'tooNew';
  if (
    !isObject(tables) ||
    !Object.values(tables).every(
      (rows) => Array.isArray(rows) && rows.every(isObject),
    )
  )
    return 'notBackup';
  return { version, tables: tables as Tables };
}
