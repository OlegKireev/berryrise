// Ключи готовых вариантов, общие для срыва и итогов дня. В базе храним ключ, подписи в i18n.ts рядом.
// Ключи одной сущности (напитки, причины, ответы) лежат в ее слайсе в entities/.
// Порядок в массиве = порядок на экране; для mood и craving еще и сила.

// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- ключи вариантов, числа и есть данные
export const moods = [1, 2, 3, 4, 5] as const;
export type Mood = (typeof moods)[number];

export const cravings = ['none', 'slight', 'noticeable', 'strong'] as const;
export type Craving = (typeof cravings)[number];

export const places = [
  'home',
  'work',
  'guests',
  'bar',
  'road',
  'outside',
] as const;
export type Place = (typeof places)[number];

export const hardships = [
  'stress',
  'fatigue',
  'boredom',
  'loneliness',
  'conflict',
  'anxiety',
  'holiday',
  'othersDrinking',
] as const;
export type Hardship = (typeof hardships)[number];

export const helpers = [
  'naDrink',
  'sport',
  'food',
  'talk',
  'sleep',
  'work',
  'hobby',
  'reasons',
  'leftEarly',
] as const;
export type Helper = (typeof helpers)[number];
