import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { setupNotifications } from './setup';
import { syncNotifications } from './sync';
import { useNotificationResponse } from './useNotificationResponse';

// Для корневого layout: канал и кнопки, расписание при старте и при каждом
// возврате в приложение (продлевает горизонт), ответы на уведомления
export function useNotifications() {
  const db = useSQLiteContext();

  useEffect(() => {
    setupNotifications().then(() => syncNotifications(db));
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') {
        syncNotifications(db);
      }
    });
    return () => sub.remove();
  }, [db]);

  useNotificationResponse();
}
