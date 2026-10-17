import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import {
  anyOn,
  ensurePermission,
  getPrefs,
  syncNotifications,
} from '@/features/notifications';

// После импорта: напоминания по настройкам из файла и на "Сегодня", экраны перечитают данные на фокусе
export function useBackup() {
  const db = useSQLiteContext();

  const onImported = async () => {
    if (anyOn(await getPrefs(db))) {
      await ensurePermission();
    }

    await syncNotifications(db);
    router.dismissTo('/');
  };

  return { onImported };
}
