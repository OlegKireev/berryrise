import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';

import { createHabit } from '@/entities/habit';

// Привычка создается только здесь, ее наличие и значит "онбординг пройден". Дальше только необязательные шаги
export function useStart() {
  const db = useSQLiteContext();

  // null - не трогали, старт в момент подтверждения
  const [startAt, setStartAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);

  const start = async () => {
    setSaving(true);
    await createHabit(db, startAt?.getTime() ?? Date.now());
    // Онбординг пройден. Сбрасываем его стек, чтобы "назад" не вернул на старт
    router.dismissAll();
    router.replace('/onboarding/spending');
  };

  return { startAt, setStartAt, saving, start };
}
