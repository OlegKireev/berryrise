import { z } from 'zod';

import { rowSchema } from '@/shared/db';

import { reasons } from './types';

// Заполнен ровно один из key и customText. Неизвестный ключ без своего текста - строка сломана
export const reasonSchema = rowSchema
  .extend({
    key: z.enum(reasons).nullable(),
    customText: z.string().nullable(),
    order: z.number().int(),
  })
  .refine((r) => (r.key === null) !== (r.customText === null));

export type ReasonRow = z.infer<typeof reasonSchema>;
