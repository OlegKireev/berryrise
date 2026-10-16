import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';

import { getHabit } from '@/entities/habit';
import {
  anyOn,
  ensurePermission,
  getPrefs,
  syncNotifications,
} from '@/features/notifications';

import { t } from '../i18n';

// Восстановление на первом шаге: есть старт в копии - онбординг пройден
export function useRestore() {
  const db = useSQLiteContext();

  const onImported = async () => {
    if (!(await getHabit(db)))
      return Alert.alert(t('restoreFromFile'), t('noStart'));
    if (anyOn(await getPrefs(db))) await ensurePermission();
    await syncNotifications(db);
    router.replace('/');
  };

  return { onImported };
}
