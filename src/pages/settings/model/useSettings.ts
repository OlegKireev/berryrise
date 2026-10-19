import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { loadAchievements } from '@/features/celebrate-achievement';
import { getHabit, updateHabitStart, type Habit } from '@/entities/habit';
import { listReasons } from '@/entities/reason';
import { listRelapses } from '@/entities/relapse';
import {
  getPrefs,
  permissionDenied,
  type NotificationPrefs,
} from '@/features/notifications';
import { dayDate, toDay } from '@/shared/lib';

import { startChange } from './startChange';

type Data = {
  habit: Habit;
  maxStart: number;
  reasonCount: number;
  prefs: NotificationPrefs;
  denied: boolean;
};

// Хаб настроек и экран трат. null - еще грузим
export function useSettings() {
  const db = useSQLiteContext();
  const [data, setData] = useState<Data | null>(null);

  // Перечитываем на фокусе: значения строк меняются в разделах
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [habit, relapses, reasons, prefs, denied] = await Promise.all([
          getHabit(db),
          listRelapses(db),
          listReasons(db),
          getPrefs(db),
          permissionDenied(),
        ]);

        if (!habit) {
          return;
        }

        // Старт не позже сегодняшнего дня и дня самого раннего срыва, локальная полночь
        const last = Math.min(Date.now(), relapses.at(-1)?.at ?? Infinity);
        setData({
          habit,
          maxStart: dayDate(toDay(last)).getTime(),
          reasonCount: reasons.length,
          prefs,
          denied,
        });
      })();
    }, [db]),
  );

  if (!data) {
    return null;
  }

  const { habit, prefs } = data;
  const on = [prefs.dayReview.on, prefs.risk.on, prefs.party.on].filter(
    Boolean,
  ).length;

  return {
    habit,
    maxStart: data.maxStart,
    spending:
      habit.weeklySpend !== null && habit.currency !== null
        ? { amount: habit.weeklySpend, currency: habit.currency }
        : null,
    reasonCount: data.reasonCount,
    // 'denied' - что-то включено, а система уведомления запретила
    notifications: on > 0 && data.denied ? ('denied' as const) : on,
    // Что потеряется с новым стартом, null - подтверждать не надо
    checkStart: async (d: Date) => {
      const now = Date.now();
      const [before, after] = await Promise.all([
        loadAchievements(db, now),
        loadAchievements(db, now, d.getTime()),
      ]);
      return before && after ? startChange(before, after) : null;
    },
    // Сохраняем сразу: поле одно, отдельная кнопка не нужна
    changeStart: async (d: Date) => {
      await updateHabitStart(db, habit.id, d.getTime());
      setData({ ...data, habit: { ...habit, startAt: d.getTime() } });
    },
  };
}
