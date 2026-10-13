import type { Row } from '@/shared/db';

// Ответы на "а чего не пьешь?"
export const replies = ['driving', 'sport', 'dontWant', 'quit'] as const;
export type Reply = (typeof replies)[number];

// Заполнен ровно один из key и customText
export type ReplyRow = Row & {
  key: Reply | null;
  customText: string | null;
  order: number;
};
