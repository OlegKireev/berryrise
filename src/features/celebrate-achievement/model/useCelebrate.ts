import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

import { hasRelapseBetween } from '@/entities/relapse';
import { dayRange, toDay } from '@/shared/lib';

import { loadAchievements } from '../api/achievements';
import { getSeen, saveSeen } from '../api/seen';
import { celebrate } from './celebrate';

// двойной фокус не должен открыть две карточки
let running = false;

// Проверка новых медалей на фокусе экрана. check() - для действий, после которых фокус
// не меняется. Новые сразу пишем в показанные: закрытая посреди очередь не повторяется
export function useCelebrate() {
  const db = useSQLiteContext();
  const check = useCallback(() => {
    if (running) return;
    running = true;
    (async () => {
      const now = Date.now();
      const { from, to } = dayRange(toDay(now));
      const [loaded, seen, relapseToday] = await Promise.all([
        loadAchievements(db, now),
        getSeen(db),
        hasRelapseBetween(db, from, to),
      ]);
      if (!loaded) return;
      const r = celebrate(loaded.got, seen, relapseToday);
      if (seen === null || r.seen.join() !== seen.join())
        await saveSeen(db, r.seen);
      const [key, ...queue] = r.show;
      if (key)
        router.push({
          pathname: '/achievement/[key]',
          params: { key, celebrate: '1', queue: queue.join(',') },
        });
    })().finally(() => {
      running = false;
    });
  }, [db]);
  useFocusEffect(check);
  return check;
}
