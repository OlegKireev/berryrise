// Общие слова: названия экранов и кнопки. Строки одного слайса лежат в его i18n.ts
const ru = {
  today: 'Сегодня',
  progress: 'Прогресс',
  reasons: 'Мои причины',
  settings: 'Настройки',
  startSpending: 'Старт и траты',
  notifications: 'Уведомления',
  about: 'О приложении',
  company: 'Иду в компанию',
  dayReview: 'Итоги дня',
  day: 'День',
  achievementsTitle: 'Достижения',
  relapse: 'Срыв',
  cancel: 'Отмена',
  save: 'Сохранить',
  delete: 'Удалить',
  add: 'Добавить',
  note: 'Заметка',
  changeDate: 'Изменить дату',
  changeTime: 'Изменить время',
  // нужен онбордингу и настройкам
  disclaimer:
    'Приложение не заменяет врача. Если тебе плохо, обратись за медицинской помощью.',
};

const en: typeof ru = {
  today: 'Today',
  progress: 'Progress',
  reasons: 'My reasons',
  settings: 'Settings',
  startSpending: 'Start and spending',
  notifications: 'Notifications',
  about: 'About',
  company: 'Going out',
  dayReview: 'Day review',
  day: 'Day',
  achievementsTitle: 'Achievements',
  relapse: 'Relapse',
  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  add: 'Add',
  note: 'Note',
  changeDate: 'Change date',
  changeTime: 'Change time',
  disclaimer:
    'This app is not a substitute for a doctor. If you feel unwell, seek medical help.',
};

export const common = { ru, en };
