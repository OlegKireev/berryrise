import { isRecord } from '../../../shared/lib/utils/json.ts';

// Маркер файла - bundle id: он не меняется, в отличие от названия приложения
export const APP = 'com.berryrise.app';

// Ячейка - то, что SQLite отдает и принимает из JSON
export type Cell = string | number | boolean | null;
export type Tables = Record<string, Record<string, Cell>[]>;
export type Backup = { version: number; tables: Tables };

const pad = (n: number) => String(n).padStart(2, '0');

// berryrise-YYYY-MM-DD-HH-mm-SS.json по локальному времени
export function backupFileName(d: Date) {
  const date = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())];
  const time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())];
  return `berryrise-${[...date, ...time].join('-')}.json`;
}

const isCell = (v: unknown): v is Cell =>
  v === null || ['string', 'number', 'boolean'].includes(typeof v);

// Таблицы из файла: объект массивов строк с простыми ячейками, иначе null
function parseTables(v: unknown): Tables | null {
  if (!isRecord(v)) {
    return null;
  }

  const tables: Tables = {};

  for (const [name, rows] of Object.entries(v)) {
    if (!Array.isArray(rows)) {
      return null;
    }

    const list: Record<string, Cell>[] = [];

    for (const row of rows) {
      if (!isRecord(row)) {
        return null;
      }

      const cells: Record<string, Cell> = {};

      for (const [k, c] of Object.entries(row)) {
        if (!isCell(c)) {
          return null;
        }

        cells[k] = c;
      }

      list.push(cells);
    }

    tables[name] = list;
  }

  return tables;
}

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

  if (!isRecord(data) || data.app !== APP) {
    return 'notBackup';
  }

  const { schemaVersion: version } = data;

  if (
    typeof version !== 'number' ||
    !Number.isInteger(version) ||
    version < 1
  ) {
    return 'notBackup';
  }

  if (version > currentVersion) {
    return 'tooNew';
  }

  const tables = parseTables(data.tables);

  if (!tables) {
    return 'notBackup';
  }

  return { version, tables };
}
