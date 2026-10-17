import { useFocusEffect } from 'expo-router';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { getDayReview } from '@/entities/day-review';
import { getPartyOn } from '@/entities/party';
import { listRelapsesBetween } from '@/entities/relapse';
import { hardships, helpers, places } from '@/shared/config';
import { dayRange, isOneOf, parseList } from '@/shared/lib';

const isPlace = isOneOf(places);
const isHardship = isOneOf(hardships);
const isHelper = isOneOf(helpers);

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
      places: parseList(r.places, isPlace),
      hardships: parseList(r.hardships, isHardship),
      note: r.note,
    })),
    party: party && { result: party.result },
    review: review && {
      mood: review.mood,
      craving: review.craving,
      places: parseList(review.places, isPlace),
      hardships: parseList(review.hardships, isHardship),
      helpers: parseList(review.helpers, isHelper),
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
