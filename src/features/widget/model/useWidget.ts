import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { updateWidget } from './updateWidget';

// Для корневого layout. Рабочий стол виден только после ухода в фон,
// поэтому обновление там покрывает любые записи в базу без вызовов по месту
export function useWidget() {
  const db = useSQLiteContext();

  useEffect(() => {
    updateWidget(db);
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'background') updateWidget(db);
    });
    return () => sub.remove();
  }, [db]);
}
