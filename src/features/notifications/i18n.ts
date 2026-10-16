import { createT } from '@/shared/i18n';

export const t = createT({
  ru: {
    channel: 'Напоминания',
    notify: {
      dayReview: {
        title: 'Итоги дня',
        body: 'Как прошел день? Это займет 15 секунд',
        fill: 'Заполнить',
      },
      risk: {
        title: 'Вечер впереди',
        body: 'Идешь туда, где будут пить?',
        company: 'Иду в компанию',
      },
      party: {
        title: 'Как прошло?',
        body: 'Отметь, как прошел вечер',
        sober: 'Без алкоголя',
        drank: 'Выпил',
      },
    },
    form: {
      dayReview: 'Итоги дня',
      risk: 'Дни риска',
      riskHint: 'Напомню перед вечером, у каждого дня свое время',
      party: 'Как прошло после компании',
      time: 'Время',
    },
    autostart: {
      title: 'Чтобы напоминания приходили',
      body: 'На этом телефоне система может закрывать приложение в фоне, и напоминания не придут. Включи для "Морс" автозапуск.',
      open: 'Включить автозапуск',
    },
  },
  en: {
    channel: 'Reminders',
    notify: {
      dayReview: {
        title: 'Day review',
        body: 'How did today go? Takes 15 seconds',
        fill: 'Fill in',
      },
      risk: {
        title: 'Evening ahead',
        body: 'Going somewhere people will drink?',
        company: 'Going out',
      },
      party: {
        title: 'How did it go?',
        body: 'Mark how your evening went',
        sober: 'Stayed sober',
        drank: 'I drank',
      },
    },
    form: {
      dayReview: 'Day review',
      risk: 'Risky days',
      riskHint: 'A reminder before the evening, each day has its own time',
      party: 'How did it go after going out',
      time: 'Time',
    },
    autostart: {
      title: 'To get reminders',
      body: 'This phone may close the app in the background, and reminders will not arrive. Turn on autostart for the app.',
      open: 'Turn on autostart',
    },
  },
});
