const ru = {
  today: 'Сегодня',
  progress: 'Прогресс',
  reasons: 'Причины',
  settings: 'Настройки',
  company: 'Иду в компанию',
  checkin: 'Чек-ин',
  relapse: 'Срыв',
  soon: 'Скоро здесь будет экран',
};

const en: typeof ru = {
  today: 'Today',
  progress: 'Progress',
  reasons: 'Reasons',
  settings: 'Settings',
  company: 'Going out',
  checkin: 'Check-in',
  relapse: 'Relapse',
  soon: 'This screen is coming soon',
};

// ponytail: язык берем из Intl при старте, без expo-localization и смены на лету
const lang = Intl.DateTimeFormat().resolvedOptions().locale.startsWith('ru') ? ru : en;

export const t = (key: keyof typeof ru) => lang[key];
