import { useSQLiteContext } from 'expo-sqlite';
import { DevSettings } from 'react-native';

import { resetDatabase } from '@/shared/db';

// Dev-сброс всех данных
export function useResetData() {
  const db = useSQLiteContext();

  return async () => {
    await resetDatabase(db);
    // Перезагрузка JS: migrate создаст схему заново, табы уведут на онбординг
    DevSettings.reload();
  };
}
