import { dayReviewDict } from '@/entities/day-review';
import { optionDict } from '@/shared/config';
import { createT } from '@/shared/i18n';

export const t = createT(
  {
    ru: {
      forToday: 'За сегодня',
      forYesterday: 'За вчера',
      forDay: 'За',
    },
    en: {
      forToday: 'For today',
      forYesterday: 'For yesterday',
      forDay: 'For',
    },
  },
  { review: dayReviewDict, option: optionDict },
);
