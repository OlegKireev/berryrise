import { defineDict, formatTime } from '@/shared/i18n';
import { MINUTES_PER_HOUR } from '@/shared/lib';

import { REVIEW_CUTOFF_HOUR } from './model/reviewDay';

export const dict = defineDict({
  ru: {
    // после него время границы: `${t('review.later')} ${cutoffTime}`
    later: 'Итоги за сегодня можно подвести с',
  },
  en: {
    later: "Today's review opens at",
  },
});

// граница итогов дня текстом, в часах локали
export const cutoffTime = formatTime(REVIEW_CUTOFF_HOUR * MINUTES_PER_HOUR);
