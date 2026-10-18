import { optionDict } from '@/shared/config';
import { createT } from '@/shared/i18n';

export const t = createT(
  {
    ru: {
      relapseSupport:
        'Бывает. Всего трезвых дней и лучший стрик никуда не денутся, новая серия начнется с этого момента.',
      relapseWhen: 'Когда',
      relapseReview: 'Разбор, по желанию',
      notePlaceholder: 'Что произошло?',
    },
    en: {
      relapseSupport:
        'It happens. Your total sober days and best streak stay with you, a new streak starts from this moment.',
      relapseWhen: 'When',
      relapseReview: 'Review, optional',
      notePlaceholder: 'What happened?',
    },
  },
  { option: optionDict },
);
