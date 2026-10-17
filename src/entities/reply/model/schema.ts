import { z } from 'zod';

import { rowSchema } from '@/shared/db';

import { replies } from './types';

// Заполнен ровно один из key и customText. Неизвестный ключ без своего текста - строка сломана
export const replySchema = rowSchema
  .extend({
    key: z.enum(replies).nullable(),
    customText: z.string().nullable(),
    order: z.number().int(),
  })
  .refine((r) => (r.key === null) !== (r.customText === null));

export type ReplyRow = z.infer<typeof replySchema>;
