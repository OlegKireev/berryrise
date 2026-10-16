import { reasonDict } from '@/entities/reason';
import { createT } from '@/shared/i18n';

export const t = createT(
  {
    ru: {
      deleteReasonTitle: 'Убрать причину из списка?',
      deleteReasonHint: 'Свою причину можно убрать долгим нажатием.',
    },
    en: {
      deleteReasonTitle: 'Remove this reason from the list?',
      deleteReasonHint: 'Long-press your own reason to remove it.',
    },
  },
  { reason: reasonDict },
);
