import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { getHabit, updateHabitStart, type Habit } from '@/entities/habit';
import { listRelapses } from '@/entities/relapse';

// Настройки привычки. null - еще грузим
export function useSettings() {
  const db = useSQLiteContext();

  const [habit, setHabit] = useState<Habit | null>(null);
  // Старт не позже текущего момента и самого раннего срыва
  const [maxStart, setMaxStart] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [h, relapses] = await Promise.all([
          getHabit(db),
          listRelapses(db),
        ]);
        setHabit(h);
        setMaxStart(Math.min(Date.now(), relapses.at(-1)?.at ?? Infinity));
      })();
    }, [db]),
  );

  if (!habit) {
    return null;
  }

  return {
    habit,
    maxStart,
    // Сохраняем сразу: поле одно, отдельная кнопка не нужна
    changeStart: async (d: Date) => {
      await updateHabitStart(db, habit.id, d.getTime());
      setHabit({ ...habit, startAt: d.getTime() });
    },
  };
}
