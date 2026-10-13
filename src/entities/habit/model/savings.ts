// Чистая логика экономии, без React Native: ее гоняет node:test.
import type { Drink } from './types.ts';

// Примерные ккал на порцию: пиво 0,5, бокал вина 150 мл, шот 40 мл, коктейль
export const drinkKcal: Record<Drink, number> = {
  beer: 215,
  wine: 125,
  shot: 95,
  cocktail: 200,
};

export type Savings = {
  money: number | null; // null - сумма не указана
  portions: number;
  kcal: number;
};

// Считаем от всех трезвых дней, а не от текущего стрика: срыв не забирает накопленное.
// Сначала умножаем, потом делим на 7, чтобы не терять дробную часть "в день".
export function savings(
  total: number,
  weeklySpend: number | null,
  drinks: Partial<Record<Drink, number>>,
): Savings {
  const perDays = (perWeek: number) => Math.floor((perWeek * total) / 7);
  const entries = Object.entries(drinks) as [Drink, number][];
  return {
    money: weeklySpend === null ? null : perDays(weeklySpend),
    portions: perDays(entries.reduce((sum, [, n]) => sum + n, 0)),
    kcal: perDays(entries.reduce((sum, [k, n]) => sum + n * drinkKcal[k], 0)),
  };
}
