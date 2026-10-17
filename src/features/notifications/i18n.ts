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
        body: 'Идешь в компанию? Возьми с собой поддержку',
        company: 'Иду',
        skip: 'Не иду',
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
      dayReviewHint:
        'Вечером спрошу, как прошел день: настроение, тяга, что помогло. Это 15 секунд.',
      risk: 'Дни риска',
      riskHint:
        'Дни, когда обычно зовут выпить. Перед вечером спрошу, идешь ли ты в компанию. Если да, открою поддержку на вечер: что пить вместо алкоголя и что ответить, если спросят.',
      party: 'Как прошло?',
      partyHint:
        'Собираешься в компанию - отметь это на "Сегодня" и укажи, до скольки примерно вечер. В это время спрошу, как прошло.',
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
        body: 'Going out tonight? Take some support with you',
        company: "I'm going",
        skip: 'Not going',
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
      dayReviewHint:
        "In the evening I'll ask how your day went: mood, cravings, what helped. Takes 15 seconds.",
      risk: 'Risky days',
      riskHint:
        "Days when you usually get invited for drinks. Before the evening I'll ask if you're going out. If so, I'll open support for the night: what to drink instead and what to say if someone asks.",
      party: 'How did it go?',
      partyHint:
        "Going out? Mark it on Today and set roughly when the evening ends. I'll ask how it went then.",
      time: 'Time',
    },
    autostart: {
      title: 'To get reminders',
      body: 'This phone may close the app in the background, and reminders will not arrive. Turn on autostart for the app.',
      open: 'Turn on autostart',
    },
  },
});
