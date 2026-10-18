// Добавляет элемент в список или убирает его. on задает действие явно
export const toggle = <T>(
  list: T[],
  item: T,
  on = !list.includes(item),
): T[] =>
  on
    ? list.includes(item)
      ? list
      : [...list, item]
    : list.filter((x) => x !== item);
