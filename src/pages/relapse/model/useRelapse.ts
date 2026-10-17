import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { getHabit, type Habit } from '@/entities/habit';
import { getParty } from '@/entities/party';
import { insertRelapse } from '@/entities/relapse';
import { logPartyRelapse } from '@/features/log-party-relapse';
import { syncNotifications } from '@/features/notifications';
import type { Hardship, Mood, Place } from '@/shared/config';
import { toggle } from '@/shared/lib';

// Форма срыва. null - еще грузим
export function useRelapse() {
  const db = useSQLiteContext();

  // Открыта кнопкой "выпил" из карточки вечеринки
  const { partyId } = useLocalSearchParams<{ partyId?: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);
  // null - не трогали, срыв в момент сохранения
  const [at, setAt] = useState<Date | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [hardships, setHardships] = useState<Hardship[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getHabit(db).then(setHabit);

    // Вечеринка уже кончилась - по умолчанию срыв в ее конце
    if (partyId) {
      getParty(db, partyId).then(
        (p) =>
          p && p.expectedEndAt < Date.now() && setAt(new Date(p.expectedEndAt)),
      );
    }
  }, [db, partyId]);

  if (!habit) {
    return null;
  }

  const save = async () => {
    setSaving(true);
    const data = {
      habitId: habit.id,
      at: at?.getTime() ?? Date.now(),
      mood,
      places,
      hardships,
      note,
    };
    await (partyId
      ? logPartyRelapse(db, partyId, data)
      : insertRelapse(db, data));

    if (partyId) {
      syncNotifications(db);
    }

    router.back();
  };

  return {
    startAt: habit.startAt,
    at,
    setAt,
    mood,
    toggleMood: (m: Mood) => setMood(mood === m ? null : m),
    places,
    togglePlace: (p: Place) => setPlaces(toggle(places, p)),
    hardships,
    toggleHardship: (h: Hardship) => setHardships(toggle(hardships, h)),
    note,
    setNote,
    saving,
    save,
  };
}
