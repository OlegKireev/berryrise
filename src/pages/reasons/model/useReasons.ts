import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import {
  addReason,
  deleteReason,
  listReasons,
  reasons,
  type NewReason,
  type Reason,
  type ReasonRow,
} from '@/entities/reason';

// Список причин. null - еще грузим
export function useReasons() {
  const db = useSQLiteContext();

  const [list, setList] = useState<ReasonRow[] | null>(null);
  const [custom, setCustom] = useState('');

  const load = useCallback(() => {
    listReasons(db).then(setList);
  }, [db]);

  useFocusEffect(load);

  if (!list) {
    return null;
  }

  const add = async (item: NewReason) => {
    await addReason(db, item);
    load();
  };

  return {
    list,
    // Готовые, которых еще нет в списке
    presets: reasons.filter((k) => !list.some((r) => r.key === k)),
    addPreset: (key: Reason) => add({ key }),
    // Без подтверждения: причину легко вернуть
    remove: (id: string) => deleteReason(db, id).then(load),
    custom,
    setCustom,
    canAddCustom: custom.trim() !== '',
    addCustom: async () => {
      await add({ customText: custom.trim() });
      setCustom('');
    },
  };
}
