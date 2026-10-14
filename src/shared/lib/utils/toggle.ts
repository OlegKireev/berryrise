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

// Вариант "ничего" снимает остальные, любой другой снимает "ничего"
export const toggleExclusive = <T>(list: T[], item: T, none: T): T[] =>
  item === none
    ? list.includes(none)
      ? []
      : [none]
    : toggle(
        list.filter((x) => x !== none),
        item,
      );
