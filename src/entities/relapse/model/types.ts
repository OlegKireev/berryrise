import type { Mood } from '@/shared/config';
import type { Row } from '@/shared/db';

export type Relapse = Row & {
  habitId: string;
  at: number;
  mood: Mood | null;
  places: string | null; // Place[]
  hardships: string | null; // Hardship[]
  note: string | null;
};
