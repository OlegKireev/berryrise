import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { listDayReviewNotes } from '@/entities/day-review';
import { listRelapseNotes } from '@/entities/relapse';

import { type NoteMonth, notesFeed } from './notes';

// Лента заметок за всю историю. null - еще грузим первый раз, перечитывает на фокусе
export function useNotes() {
  const db = useSQLiteContext();
  const [feed, setFeed] = useState<NoteMonth[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([listDayReviewNotes(db), listRelapseNotes(db)]).then(
        ([reviews, relapses]) =>
          active && setFeed(notesFeed({ reviews, relapses })),
      );
      return () => {
        active = false;
      };
    }, [db]),
  );

  return feed;
}
