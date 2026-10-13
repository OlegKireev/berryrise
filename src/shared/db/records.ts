import { randomUUID } from 'expo-crypto';

// Служебные поля всех таблиц, кроме settings. Время в epoch ms, булевы как 0/1,
// JSON-колонки приходят строкой (тип после JSON.parse указан в комментарии у поля).
export type Row = {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
};

// Строка таблицы settings, value в JSON
export type Setting = { key: string; value: string };

// Служебные поля новой записи
export function newRow(): Row {
  const now = Date.now();
  return { id: randomUUID(), createdAt: now, updatedAt: now, deletedAt: null };
}
