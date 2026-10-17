// Что пьет на вечеринке вместо алкоголя
export const partyDrinks = [
  'naBeer',
  'naCocktails',
  'tea',
  'juice',
  'water',
] as const;
export type PartyDrink = (typeof partyDrinks)[number];
