import { reasonDict } from '@/entities/reason';
import { createT } from '@/shared/i18n';

export const t = createT(
  {
    ru: {
      noReasons: 'Пока нет причин. Добавь то, ради чего бросаешь.',
      addReasonTitle: 'Добавить причину',
    },
    en: {
      noReasons: "No reasons yet. Add what you're quitting for.",
      addReasonTitle: 'Add a reason',
    },
  },
  { reason: reasonDict },
);
