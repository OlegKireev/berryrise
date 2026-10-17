import { z } from 'zod';

import { hardships, moods, places } from '@/shared/config';
import { jsonList, optional, rowSchema } from '@/shared/db';

export const relapseSchema = rowSchema.extend({
  habitId: z.string(),
  at: z.number().int(),
  mood: optional(z.literal(moods), 'mood'),
  places: jsonList(z.enum(places), 'places'),
  hardships: jsonList(z.enum(hardships), 'hardships'),
  note: z.string().nullable(),
});
