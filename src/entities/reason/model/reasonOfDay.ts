// Причина дня: одна на календарный день, по кругу в порядке списка.
// Чистая логика

// day: локальная дата YYYY-MM-DD. Номер дня от эпохи растет на 1 каждый день,
// поэтому в соседние дни берутся соседние причины
export function reasonOfDay<T>(list: T[], day: string): T | null {
  if (list.length === 0) {
    return null;
  }

  // строка без времени разбирается как полночь UTC, без сдвигов часового пояса
  const n = Date.parse(day) / 86400000;
  return list[n % list.length] ?? null;
}
