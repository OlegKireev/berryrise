import { createT } from '@/shared/i18n';

export const t = createT({
  ru: {
    startAt: 'Старт',
    version: 'Версия',
    notificationsDenied:
      'Уведомления выключены в системе, напоминания не придут.',
    openSystemSettings: 'Включить в настройках',
    backupHint:
      'В файле все твои данные, включая заметки. Храни его там, куда не заглядывают посторонние. Импорт заменит все данные на телефоне данными из файла.',
  },
  en: {
    startAt: 'Start',
    version: 'Version',
    notificationsDenied:
      'Notifications are turned off in system settings, reminders will not arrive.',
    openSystemSettings: 'Turn on in settings',
    backupHint:
      'The file contains all your data, including notes. Keep it somewhere private. Import replaces all data on this phone with the data from the file.',
  },
});
