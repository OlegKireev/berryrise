import { createT } from '@/shared/i18n';

export const t = createT({
  ru: {
    errorTitle: 'Что-то пошло не так',
    errorText:
      'Экран не смог открыться. Данные на месте, ошибка записана в журнал (Настройки, О приложении).',
    retry: 'Заново',
  },
  en: {
    errorTitle: 'Something went wrong',
    errorText:
      'This screen failed to open. Your data is safe, the error is saved to the log (Settings, About).',
    retry: 'Try again',
  },
});
