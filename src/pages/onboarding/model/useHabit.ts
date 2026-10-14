import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { getHabit, type Habit } from '@/entities/habit';

// Привычка, созданная на шаге старта. null - еще грузим
export function useHabit() {
  const db = useSQLiteContext();

  const [habit, setHabit] = useState<Habit | null>(null);

  useEffect(() => {
    getHabit(db).then(setHabit);
  }, [db]);

  return habit;
}
