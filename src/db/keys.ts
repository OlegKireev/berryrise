// Ключи готовых вариантов. В базе храним ключ, подпись берем из i18n.
// Порядок в массиве = порядок на экране; для mood и craving еще и сила.

export const moods = [1, 2, 3, 4, 5] as const;
export type Mood = (typeof moods)[number];

export const cravings = ['none', 'slight', 'noticeable', 'strong'] as const;
export type Craving = (typeof cravings)[number];

export const places = [
  'home',
  'work',
  'company',
  'bar',
  'family',
  'road',
] as const;
export type Place = (typeof places)[number];

export const hardships = [
  'stress',
  'fatigue',
  'boredom',
  'loneliness',
  'holiday',
  'othersDrinking',
  'nothing',
] as const;
export type Hardship = (typeof hardships)[number];

export const helpers = [
  'naDrink',
  'sport',
  'food',
  'talk',
  'sleep',
  'activity',
  'notNeeded',
] as const;
export type Helper = (typeof helpers)[number];

// Что пил раньше: пресеты для экономии и калорий
export const drinks = ['beer', 'wine', 'shot', 'cocktail'] as const;
export type Drink = (typeof drinks)[number];

// Что пьет на вечеринке вместо алкоголя
export const partyDrinks = [
  'naBeer',
  'naCocktails',
  'tea',
  'juice',
  'water',
] as const;
export type PartyDrink = (typeof partyDrinks)[number];

export const reasons = [
  'health',
  'sleep',
  'money',
  'family',
  'clarity',
  'control',
  'fitness',
] as const;
export type Reason = (typeof reasons)[number];

// Ответы на "а чего не пьешь?"
export const replies = ['driving', 'sport', 'dontWant', 'quit'] as const;
export type Reply = (typeof replies)[number];
