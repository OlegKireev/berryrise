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
    myReasons: 'Мои причины',
    customReason: 'Своя причина',
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
    myReasons: 'My reasons',
    customReason: 'Your own reason',
  },
});

export const t = createT(dict);
