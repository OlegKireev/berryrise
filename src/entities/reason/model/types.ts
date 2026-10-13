import type { Row } from '@/shared/db';

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

// Заполнен ровно один из key и customText
export type ReasonRow = Row & {
  key: Reason | null;
  customText: string | null;
  order: number;
};
