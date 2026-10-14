import { habitDict } from '@/entities/habit';
import { createT } from '@/shared/i18n';

export const t = createT(
  {
    ru: {
      relapses: 'Срывы',
      noRelapses: 'Срывов не было',
      calendar: 'Календарь',
      prevMonth: 'Предыдущий месяц',
      nextMonth: 'Следующий месяц',
      legendSober: 'Трезвый',
      legendRelapse: 'Срыв',
      achievementsTitle: 'Ачивки',
      achievementsGot: 'Получено',
      of: 'из',
    },
    en: {
      relapses: 'Relapses',
      noRelapses: 'No relapses',
      calendar: 'Calendar',
      prevMonth: 'Previous month',
      nextMonth: 'Next month',
      legendSober: 'Sober',
      legendRelapse: 'Relapse',
      achievementsTitle: 'Achievements',
      achievementsGot: 'Unlocked',
      of: 'of',
    },
  },
  { habit: habitDict },
);
