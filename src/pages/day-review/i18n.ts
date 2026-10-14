import { dayReviewDict } from '@/entities/day-review';
import { optionDict } from '@/shared/config';
import { createT } from '@/shared/i18n';

export const t = createT(
  {
    ru: {
      forToday: 'За сегодня',
      forYesterday: 'За вчера',
    },
    en: {
      forToday: 'For today',
      forYesterday: 'For yesterday',
    },
  },
  { review: dayReviewDict, option: optionDict },
);
