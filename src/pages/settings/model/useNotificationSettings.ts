import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import {
  anyOn,
  ensurePermission,
  getPrefs,
  needsAutostartHint,
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
  const [autostartHint, setAutostartHint] = useState(needsAutostartHint);

  const checkPermission = () => permissionDenied().then(setDenied);

  // Автозапуск включают из подсказки в системе: возврат оттуда не дает фокуса экрану
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') {
        setAutostartHint(needsAutostartHint());
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  // Разрешение могли поменять в системе, пока экран был закрыт
  useFocusEffect(
    useCallback(() => {
      getPrefs(db).then(setPrefs);
      checkPermission();
      setAutostartHint(needsAutostartHint());
    }, [db]),
  );

  if (!prefs) {
    return null;
  }

  return {
    prefs,
    // выключено в системе, а у нас что-то включено
    denied: denied && anyOn(prefs),
    autostartHint,
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
