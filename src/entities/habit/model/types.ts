import type { Row } from '@/shared/db';

// Что пил раньше: пресеты для экономии и калорий
/** @public */
export const drinks = ['beer', 'wine', 'shot', 'cocktail'] as const;
/** @public */
export type Drink = (typeof drinks)[number];

export type Habit = Row & {
  type: 'alcohol';
  startAt: number;
  weeklySpend: number | null; // в неделю, целые единицы валюты
  currency: string | null;
  drinks: string; // Partial<Record<Drink, number>>, порций в неделю
};
