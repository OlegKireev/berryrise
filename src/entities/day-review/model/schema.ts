import { z } from 'zod';

import { cravings, hardships, helpers, moods } from '@/shared/config';
import { jsonList, rowSchema } from '@/shared/db';

export const dayReviewSchema = rowSchema.extend({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD, локальная дата
  mood: z.literal(moods),
  craving: z.enum(cravings),
  hardships: jsonList(z.enum(hardships), 'hardships'),
  helpers: jsonList(z.enum(helpers), 'helpers'),
  note: z.string().nullable(),
});
