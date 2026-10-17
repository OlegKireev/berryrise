import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

import { logError } from '@/shared/lib';

const TASK = 'notification-response';

// Кнопки без открытия приложения ("Не иду"). Когда процесс выгружен,
// useNotificationResponse не запущен, и уведомление закрывает эта задача.
// Задачу зовет и живое приложение в фоне, повторное закрытие ничего не ломает
TaskManager.defineTask<Notifications.NotificationTaskPayload>(
  TASK,
  async ({ data }) => {
    if ('actionIdentifier' in data && data.actionIdentifier === 'skip') {
      await Notifications.dismissNotificationAsync(
        data.notification.request.identifier,
      );
    }
  },
);

// Регистрация до старта приложения, из корневого index.ts
export const registerNotificationTask = () =>
  Notifications.registerTaskAsync(TASK).catch((e: unknown) => {
    logError('notifications', e);
  });
