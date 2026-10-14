const pad = (n: number) => String(n).padStart(2, '0');

// Локальная дата в формате YYYY-MM-DD. Такие строки сравниваются лексикографически
export const toDay = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
