import { habitDict } from '@/entities/habit';
import { createT } from '@/shared/i18n';

export const t = createT(
  {
    ru: {
      weeklySpend: 'Сумма в неделю',
      drinksTitle: 'Что пил, порций в неделю',
    },
    en: {
      weeklySpend: 'Per week',
      drinksTitle: 'What you drank, drinks per week',
    },
  },
  { habit: habitDict },
);
