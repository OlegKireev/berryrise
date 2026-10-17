import { z } from 'zod';

import { jsonCounts, rowSchema } from '@/shared/db';

import { drinks } from './types';

export const habitSchema = rowSchema.extend({
  type: z.literal('alcohol'),
  startAt: z.number().int(),
  weeklySpend: z.number().nullable(), // в неделю, целые единицы валюты
  currency: z.string().nullable(),
  drinks: jsonCounts(drinks, 'drinks'), // порций в неделю
});

export type Habit = z.infer<typeof habitSchema>;
