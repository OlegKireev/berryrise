import { createT, defineDict } from '@/shared/i18n';

export const dict = defineDict({
  ru: {
    labels: {
      health: 'Здоровье',
      sleep: 'Нормальный сон',
      money: 'Деньги',
      family: 'Семья',
      clarity: 'Ясная голова',
      control: 'Контроль над собой',
      fitness: 'Спорт и форма',
    },
    customReason: 'Например, ради дочери',
  },
  en: {
    labels: {
      health: 'Health',
      sleep: 'Better sleep',
      money: 'Money',
      family: 'Family',
      clarity: 'Clear head',
      control: 'Self-control',
      fitness: 'Fitness',
    },
    customReason: 'For example, my kids',
  },
});

export const t = createT(dict);
