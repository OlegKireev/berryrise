import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import {
  anyOn,
  ensurePermission,
  getPrefs,
  permissionDenied,
  savePrefs,
  syncNotifications,
  type NotificationPrefs,
} from '@/features/notifications';

// Настройки уведомлений. null - еще грузим
export function useNotificationSettings() {
  const db = useSQLiteContext();

  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [denied, setDenied] = useState(false);

  const checkPermission = () => permissionDenied().then(setDenied);

  // Разрешение могли поменять в системе, пока экран был закрыт
  useFocusEffect(
    useCallback(() => {
      getPrefs(db).then(setPrefs);
      checkPermission();
    }, [db]),
  );

  if (!prefs) {
    return null;
  }

  return {
    prefs,
    // выключено в системе, а у нас что-то включено
    denied: denied && anyOn(prefs),
    // Сохраняем сразу, как и старт
    change: async (p: NotificationPrefs) => {
      setPrefs(p);
      await savePrefs(db, p);
      if (anyOn(p)) {
        await ensurePermission();
        await checkPermission();
      }
      await syncNotifications(db);
    },
  };
}
