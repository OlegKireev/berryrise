// Разбор JSON из базы и файлов без `as`: что не подходит по форме, отбрасываем

export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export const isString = (v: unknown): v is string => typeof v === 'string';

// Проверка "значение из списка": isOneOf(drinks)(v)
export const isOneOf =
  <T>(list: readonly T[]) =>
  (v: unknown): v is T =>
    list.some((x) => x === v);

// JSON.parse, который не бросает: битая строка и null - это null
export function parseJson(json: string | null): unknown {
  if (json === null) {
    return null;
  }

  try {
    const value: unknown = JSON.parse(json);
    return value;
  } catch {
    return null;
  }
}

// Массив из JSON: только элементы, прошедшие проверку
export function parseList<T>(
  json: string | null,
  isItem: (v: unknown) => v is T,
): T[] {
  const v = parseJson(json);
  return Array.isArray(v) ? v.filter(isItem) : [];
}
