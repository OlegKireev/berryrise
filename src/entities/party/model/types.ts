import type { Row } from '@/shared/db';

// Что пьет на вечеринке вместо алкоголя
export const partyDrinks = [
  'naBeer',
  'naCocktails',
  'tea',
  'juice',
  'water',
] as const;
export type PartyDrink = (typeof partyDrinks)[number];

export type Party = Row & {
  startAt: number;
  expectedEndAt: number;
  drinkKeys: string; // PartyDrink[]
  drinkCustoms: string; // string[], свои напитки
  result: 'sober' | 'drank' | null;
  relapseId: string | null;
};
