import { z } from 'zod';

import { jsonList, rowSchema } from '@/shared/db';

import { partyDrinks } from './types';

export const partySchema = rowSchema.extend({
  startAt: z.number().int(),
  expectedEndAt: z.number().int(),
  drinkKeys: jsonList(z.enum(partyDrinks), 'drinkKeys'),
  drinkCustoms: jsonList(z.string(), 'drinkCustoms'), // свои напитки
  result: z.enum(['sober', 'drank']).nullable(),
  relapseId: z.string().nullable(),
});

export type Party = z.infer<typeof partySchema>;
