import { dayReviewDict } from '@/entities/day-review';
import { optionDict } from '@/shared/config';
import { createT } from '@/shared/i18n';

export const t = createT(
  {
    ru: {
      forToday: 'За сегодня',
      forYesterday: 'За вчера',
      forDay: 'За',
      done: 'День записан',
      notePlaceholder: 'Что-то, что хочется не забыть',
    },
    en: {
      forToday: 'For today',
      forYesterday: 'For yesterday',
      forDay: 'For',
      done: 'Day saved',
      notePlaceholder: 'Something you want to remember',
    },
  },
  { review: dayReviewDict, option: optionDict },
);
