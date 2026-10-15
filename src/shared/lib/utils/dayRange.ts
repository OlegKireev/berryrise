// Границы локального дня YYYY-MM-DD: [from, to) в epoch ms.
// Через конструктор Date, а не +24ч: в день перехода на летнее время в сутках 23 или 25 часов
export const dayRange = (date: string) => {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return {
    from: new Date(y, m - 1, d).getTime(),
    to: new Date(y, m - 1, d + 1).getTime(),
  };
};
