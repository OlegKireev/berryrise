import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';

import { createHabit } from '@/entities/habit';
import { dayDate, toDay } from '@/shared/lib';

// Привычка создается только здесь, ее наличие и значит "онбординг пройден". Дальше только необязательные шаги
export function useStart() {
  const db = useSQLiteContext();

  // Последний день с алкоголем, локальная полночь. По умолчанию сегодня
  const [startAt, setStartAt] = useState(() => dayDate(toDay(Date.now())));
  const [saving, setSaving] = useState(false);

  const start = async () => {
    setSaving(true);
    await createHabit(db, startAt.getTime());
    // Онбординг пройден. Сбрасываем его стек, чтобы "назад" не вернул на старт
    router.dismissAll();
    router.replace('/onboarding/spending');
  };

  return { startAt, setStartAt, saving, start };
}
