import { randomUUID } from 'expo-crypto';
import type { z } from 'zod';

import type { rowSchema } from './schema';

// Служебные поля всех таблиц, кроме settings
export type Row = z.infer<typeof rowSchema>;

// Строка таблицы settings, value в JSON
/** @public */
export type Setting = { key: string; value: string };

// Служебные поля новой записи
export function newRow(): Row {
  const now = Date.now();
  return { id: randomUUID(), createdAt: now, updatedAt: now, deletedAt: null };
}
