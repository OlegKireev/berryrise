// Проверка строк из базы схемами zod: тип строки - z.infer от схемы, тип и проверка не расходятся.
// Варианты (элементы списков, необязательные ключи) не прошли - мягкий фолбэк с записью в журнал,
// сломан скелет строки - строка пропускается или чтение падает, по выбору вызывающего
import { z } from 'zod';

import {
  isOneOf,
  isRecord,
  isString,
  log,
  logError,
  parseJson,
} from '@/shared/lib';

// Служебные колонки всех таблиц, кроме settings. Время в epoch ms
export const rowSchema = z.object({
  id: z.string(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  deletedAt: z.number().int().nullable(),
});

// ponytail: таблица и id текущей строки в модульной переменной, фолбэку поля их иначе не узнать.
// Работает, пока разбор синхронный; станет асинхронным - передавать контекст явно
let current = { table: '', id: '' };
const reported = new Set<string>();

// Экраны перечитывают базу на каждом фокусе: одна запись в журнал на ключ за запуск
function firstTime(key: string) {
  if (reported.has(key)) {
    return false;
  }

  reported.add(key);
  return true;
}

// Неизвестное значение в колонке: в журнал без самого значения (там могут быть данные пользователя)
function drift(column: string) {
  const key = `${current.table}.${column}`;

  if (firstTime(key)) {
    log('db', `${key}: неизвестное значение, строка ${current.id}`);
  }
}

const parseText = (v: unknown) => (isString(v) ? parseJson(v) : null);

// JSON-массив в TEXT: остаются только элементы, прошедшие item; NULL - пустой список
export const jsonList = <T extends z.ZodType>(item: T, column: string) =>
  z.unknown().transform((json) => {
    const v = parseText(json);
    const out: z.output<T>[] = [];

    if (!Array.isArray(v)) {
      if (json !== null) {
        drift(column);
      }

      return out;
    }

    for (const x of v) {
      const r = item.safeParse(x);

      if (r.success) {
        out.push(r.data);
      } else {
        drift(column);
      }
    }

    return out;
  });

// JSON-объект "ключ из списка -> число" в TEXT, остальные поля отбрасываются
export const jsonCounts = <K extends string>(
  keys: readonly K[],
  column: string,
) =>
  z.unknown().transform((json) => {
    const v = parseText(json);
    const out: Partial<Record<K, number>> = {};
    const isKey = isOneOf(keys);

    if (!isRecord(v)) {
      drift(column);
      return out;
    }

    for (const [k, n] of Object.entries(v)) {
      if (isKey(k) && typeof n === 'number') {
        out[k] = n;
      } else {
        drift(column);
      }
    }

    return out;
  });

// Необязательный вариант: неизвестное значение читается как null
export const optional = <T extends z.ZodType>(schema: T, column: string) =>
  schema.nullable().catch(() => {
    drift(column);
    return null;
  });

// Что делать со строкой, у которой сломан скелет: throw - строки, без которых
// врут стрик и экономия (habit, relapse); skip - остальные
type OnBroken = 'throw' | 'skip';

const rowId = (row: unknown) =>
  isRecord(row) && isString(row.id) ? row.id : '?';

export function parseRows<T extends z.ZodType>(
  table: string,
  schema: T,
  rows: unknown[],
  onBroken: OnBroken,
): z.output<T>[] {
  const out: z.output<T>[] = [];

  for (const row of rows) {
    current = { table, id: rowId(row) };
    const r = schema.safeParse(row);

    if (r.success) {
      out.push(r.data);
      continue;
    }

    // только пути полей, без значений
    const fields = r.error.issues.map((i) => i.path.join('.')).join(', ');
    const e = new Error(`${table} ${current.id}: сломаны поля ${fields}`);

    if (firstTime(`${table}:${fields}`)) {
      logError('db', e);
    }

    if (onBroken === 'throw') {
      throw e;
    }
  }

  return out;
}

// То же для getFirstAsync: null остается null, пропущенная строка - тоже null
export function parseRow<T extends z.ZodType>(
  table: string,
  schema: T,
  row: unknown,
  onBroken: OnBroken,
): z.output<T> | null {
  if (row === null) {
    return null;
  }

  const [first] = parseRows(table, schema, [row], onBroken);
  return first ?? null;
}
