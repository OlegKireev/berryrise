import { createT } from '@/shared/i18n';

export const t = createT({
  ru: {
    startAt: 'Старт',
    notifications: 'Уведомления',
    notificationsDenied:
      'Уведомления выключены в системе, напоминания не придут.',
    openSystemSettings: 'Включить в настройках',
  },
  en: {
    startAt: 'Start',
    notifications: 'Notifications',
    notificationsDenied:
      'Notifications are turned off in system settings, reminders will not arrive.',
    openSystemSettings: 'Turn on in settings',
  },
});
