import type { Craving, Mood } from '@/shared/config';
import type { Row } from '@/shared/db';

export type DayReview = Row & {
  date: string; // YYYY-MM-DD, локальная дата
  mood: Mood;
  craving: Craving;
  places: string; // Place[]
  hardships: string; // Hardship[]
  helpers: string; // Helper[]
  note: string | null;
};
