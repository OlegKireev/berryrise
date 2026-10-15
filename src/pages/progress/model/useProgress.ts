import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { loadAchievements } from '@/features/celebrate-achievement';
import { syncNotifications } from '@/features/notifications';

type Data = NonNullable<Awaited<ReturnType<typeof loadAchievements>>> & {
  now: number;
};

// Данные экрана "Прогресс". null - еще грузим
export function useProgress() {
  const db = useSQLiteContext();
  const [data, setData] = useState<Data | null>(null);

  const load = useCallback(() => {
    (async () => {
      const now = Date.now();
      const loaded = await loadAchievements(db, now);
      if (loaded) setData({ ...loaded, now });
    })();
  }, [db]);

  useFocusEffect(load);

  if (!data) {
    return null;
  }

  return {
    startAt: data.startAt,
    now: data.now,
    days: data.days,
    best: data.best,
    total: data.total,
    reviewDates: new Set(data.reviewDates),
    got: data.got,
    states: data.states,
    gotCount: data.gotCount,
    // удаление срыва из вечеринки снова делает ее идущей: нужен "как прошло?"
    reload: () => {
      syncNotifications(db);
      load();
    },
  };
}
