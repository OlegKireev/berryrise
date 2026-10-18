import { useFocusEffect } from 'expo-router';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { getDayReview } from '@/entities/day-review';
import { getPartyOn } from '@/entities/party';
import { listRelapsesBetween } from '@/entities/relapse';
import { dayRange } from '@/shared/lib';

const load = async (db: SQLiteDatabase, date: string) => {
  const { from, to } = dayRange(date);
  const [relapses, party, review] = await Promise.all([
    listRelapsesBetween(db, from, to),
    getPartyOn(db, from, to),
    getDayReview(db, date),
  ]);
  return {
    date,
    relapses: relapses.map((r) => ({
      id: r.id,
      at: r.at,
      mood: r.mood,
      places: r.places,
      hardships: r.hardships,
      note: r.note,
    })),
    party: party && { result: party.result },
    review: review && {
      mood: review.mood,
      craving: review.craving,
      hardships: review.hardships,
      helpers: review.helpers,
      note: review.note,
    },
  };
};

type Data = Awaited<ReturnType<typeof load>>;

// Срывы, вечеринка и итоги за день YYYY-MM-DD. null - еще грузим первый раз.
// Перечитывает при смене дня и на фокусе: после возврата из итогов дня карточка свежая.
// При смене дня до загрузки нового отдает прежний (со своей date), чтобы экран не моргал
export function useDayCard(date: string) {
  const db = useSQLiteContext();
  const [data, setData] = useState<Data | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      load(db, date).then((d) => active && setData(d));
      // быстрый тап по другому дню: ответ за прошлый день не нужен
      return () => {
        active = false;
      };
    }, [db, date]),
  );

  return { data, reload: () => load(db, date).then(setData) };
}
