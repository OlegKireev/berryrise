import { createT } from '@/shared/i18n';

export const t = createT({
  ru: {
    exportData: 'Экспортировать',
    importData: 'Импортировать',
    exportWhere:
      'Сохранить копию в папку на телефоне или отправить в другое приложение?',
    saveToPhone: 'Сохранить на телефон',
    send: 'Отправить',
    saved: 'Сохранено',
    restored: 'Данные восстановлены из файла',
    saveFailed: 'Не удалось сохранить файл.',
    replaceTitle: 'Заменить данные?',
    replaceText:
      'Все текущие данные на телефоне удалятся, вместо них будут данные из файла.',
    replace: 'Заменить',
    importFailed: 'Не удалось импортировать',
    notBackup: 'Это не резервная копия "Морс".',
    tooNew: 'Файл сделан в более новой версии приложения. Обнови приложение.',
    damaged: 'Файл поврежден, данные не изменились.',
  },
  en: {
    exportData: 'Export',
    importData: 'Import',
    exportWhere:
      'Save a copy to a folder on this phone or send it to another app?',
    saveToPhone: 'Save to phone',
    send: 'Send',
    saved: 'Saved',
    restored: 'Data restored from the file',
    saveFailed: 'Could not save the file.',
    replaceTitle: 'Replace data?',
    replaceText:
      'All current data on this phone will be deleted and replaced with the data from the file.',
    replace: 'Replace',
    importFailed: 'Import failed',
    notBackup: 'This is not a Berryrise backup.',
    tooNew:
      'This file was made in a newer version of the app. Please update the app.',
    damaged: 'The file is damaged, your data has not changed.',
  },
});
