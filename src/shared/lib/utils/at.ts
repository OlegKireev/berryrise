// Элемент по индексу, который точно есть по логике кода (индекс из цикла, по модулю длины).
// Вместо `list[i]!`: при ошибке падает с понятным текстом, а не тащит undefined дальше
export function at<T>(list: readonly T[], i: number): T {
  const v = list[i];

  if (v === undefined) {
    throw new RangeError(`at: нет элемента ${i} в списке длины ${list.length}`);
  }

  return v;
}
