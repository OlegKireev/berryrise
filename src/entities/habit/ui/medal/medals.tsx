import type { ComponentType } from 'react';

import type { AchievementKey } from '../../model/achievements';
import {
  Comeback7,
  Comeback7Over,
  Company1,
  Company10,
  Company10Over,
  Company5,
  Friday,
  Reviews7,
  Weekend,
} from './badges';
import {
  Day1,
  Day14,
  Day180,
  Day3,
  Day30,
  Day365,
  Day365Over,
  Day60,
  Day7,
  Day90,
  Year2,
  Year2Over,
  Year3,
  Year3Over,
  Year4,
  Year4Over,
  Year5,
  Year5Over,
} from './climb';
import type { Shape } from './frames';
import type { MetalKey } from './palette';

type Config = {
  shape: Shape;
  metal: MetalKey;
  Scene: ComponentType;
  Over?: ComponentType; // часть сцены поверх рамки
};

type Art = Pick<Config, 'Scene' | 'Over'>;

const streak = (metal: MetalKey, art: Art): Config => ({
  shape: 'hex',
  metal,
  ...art,
});

const badge = (metal: MetalKey, art: Art): Config => ({
  shape: 'oct',
  metal,
  ...art,
});

// Матрица медалей: материал по уровню, внутри уровня растет детализация сцены (design.md)
export const medals: Record<AchievementKey, Config> = {
  days1: streak('bronze', { Scene: Day1 }),
  days3: streak('bronze', { Scene: Day3 }),
  days7: streak('bronze', { Scene: Day7 }),
  days14: streak('silver', { Scene: Day14 }),
  days30: streak('silver', { Scene: Day30 }),
  days60: streak('silver', { Scene: Day60 }),
  days90: streak('gold', { Scene: Day90 }),
  days180: streak('gold', { Scene: Day180 }),
  days365: streak('gold', { Scene: Day365, Over: Day365Over }),
  days730: streak('platinum', { Scene: Year2, Over: Year2Over }),
  days1095: streak('platinum', { Scene: Year3, Over: Year3Over }),
  days1460: streak('platinum', { Scene: Year4, Over: Year4Over }),
  days1825: streak('platinum', { Scene: Year5, Over: Year5Over }),
  friday: badge('sage', { Scene: Friday }),
  weekend: badge('sage', { Scene: Weekend }),
  reviews7: badge('sage', { Scene: Reviews7 }),
  comeback7: badge('sage', { Scene: Comeback7, Over: Comeback7Over }),
  company1: badge('bronze', { Scene: Company1 }),
  company5: badge('silver', { Scene: Company5 }),
  company10: badge('gold', { Scene: Company10, Over: Company10Over }),
};
