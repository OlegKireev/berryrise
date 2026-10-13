import type { Craving, Mood, PartyDrink, Reason, Reply } from './keys';

// Строки таблиц как они лежат в базе. Время в epoch ms, булевы как 0/1.
// JSON-колонки приходят строкой, в комментарии указан тип после JSON.parse.

export type Row = {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
};

export type Habit = Row & {
  type: 'alcohol';
  startAt: number;
  weeklySpendMinor: number | null;
  currency: string | null;
  drinks: string; // Partial<Record<Drink, number>>, порций в неделю
  naCountsAsRelapse: 0 | 1;
};

export type Relapse = Row & {
  habitId: string;
  at: number;
  mood: Mood | null;
  places: string | null; // Place[]
  hardships: string | null; // Hardship[]
  note: string | null;
};

export type Checkin = Row & {
  date: string; // YYYY-MM-DD, локальная дата
  mood: Mood;
  craving: Craving;
  places: string; // Place[]
  hardships: string; // Hardship[]
  helpers: string; // Helper[]
  note: string | null;
};

export type Party = Row & {
  startAt: number;
  expectedEndAt: number;
  drinkKey: PartyDrink | null;
  drinkCustom: string | null;
  result: 'sober' | 'drank' | null;
  relapseId: string | null;
};

// Заполнен ровно один из key и customText
export type ReasonRow = Row & {
  key: Reason | null;
  customText: string | null;
  order: number;
};
export type ReplyRow = Row & {
  key: Reply | null;
  customText: string | null;
  order: number;
};

export type Contact = Row & { name: string; phone: string; order: number };

export type Setting = { key: string; value: string }; // value в JSON
