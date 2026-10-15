import { habitDict } from '@/entities/habit';
import { createT } from '@/shared/i18n';

export const t = createT(
  {
    ru: {
      relapses: 'Срывы',
      noRelapses: 'Срывов не было',
      calendar: 'Календарь',
      bestStreak: 'Лучший стрик',
      totalDays: 'Всего трезвых',
      prevMonth: 'Предыдущий месяц',
      nextMonth: 'Следующий месяц',
      legendSober: 'Трезвый',
      legendRelapse: 'Срыв',
      allAchievements: 'Все',
      achievementsGot: 'Получено',
      of: 'из',
    },
    en: {
      relapses: 'Relapses',
      noRelapses: 'No relapses',
      calendar: 'Calendar',
      bestStreak: 'Best streak',
      totalDays: 'Total sober',
      prevMonth: 'Previous month',
      nextMonth: 'Next month',
      legendSober: 'Sober',
      legendRelapse: 'Relapse',
      allAchievements: 'All',
      achievementsGot: 'Unlocked',
      of: 'of',
    },
  },
  { habit: habitDict },
);
