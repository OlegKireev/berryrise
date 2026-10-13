import type { Row } from '@/shared/db';

// Что пил раньше: пресеты для экономии и калорий
export const drinks = ['beer', 'wine', 'shot', 'cocktail'] as const;
export type Drink = (typeof drinks)[number];

export type Habit = Row & {
  type: 'alcohol';
  startAt: number;
  weeklySpendMinor: number | null;
  currency: string | null;
  drinks: string; // Partial<Record<Drink, number>>, порций в неделю
  naCountsAsRelapse: 0 | 1;
};
