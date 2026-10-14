import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { reviewDay, getDayReview, saveDayReview } from '@/entities/day-review';
import { getHabit } from '@/entities/habit';
import { hasPartyOn } from '@/entities/party';
import { listReasons, type ReasonRow } from '@/entities/reason';
import type { Craving, Hardship, Helper, Mood, Place } from '@/shared/config';
import { toDay, toggle, toggleExclusive } from '@/shared/lib';

// Форма итогов дня. null - еще грузим
export function useDayReview() {
  const db = useSQLiteContext();

  // День считаем один раз при открытии: сохраняем ровно за тот, что в заголовке
  const [{ day, isToday }] = useState(() => {
    const now = Date.now();
    const day = reviewDay(now);
    return { day, isToday: day === toDay(now) };
  });
  const [state, setState] = useState<{
    beforeStart: boolean;
    reasons: ReasonRow[];
  } | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [craving, setCraving] = useState<Craving | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [hardships, setHardships] = useState<Hardship[]>([]);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [habit, reasons, existing] = await Promise.all([
        getHabit(db),
        listReasons(db),
        getDayReview(db, day),
      ]);
      if (existing) {
        setMood(existing.mood);
        setCraving(existing.craving);
        setPlaces(JSON.parse(existing.places));
        setHardships(JSON.parse(existing.hardships));
        setHelpers(JSON.parse(existing.helpers));
        setNote(existing.note ?? '');
      } else {
        // Была вечеринка в этот день - заранее выбираем место "в компании"
        const [y, m, d] = day.split('-').map(Number) as [
          number,
          number,
          number,
        ];
        const from = new Date(y, m - 1, d).getTime();
        const to = new Date(y, m - 1, d + 1).getTime();
        if (await hasPartyOn(db, from, to)) setPlaces(['company']);
      }
      setState({
        beforeStart: !habit || day < toDay(habit.startAt),
        reasons,
      });
    })();
  }, [db, day]);

  if (!state) {
    return null;
  }

  const save = async () => {
    if (mood === null || craving === null) return;
    setSaving(true);
    await saveDayReview(db, {
      date: day,
      mood,
      craving,
      places,
      hardships,
      helpers,
      note,
    });
    router.back();
  };

  return {
    ...state,
    day,
    isToday,
    mood,
    setMood,
    craving,
    setCraving,
    places,
    togglePlace: (p: Place) => setPlaces(toggle(places, p)),
    hardships,
    toggleHardship: (h: Hardship) =>
      setHardships(toggleExclusive(hardships, h, 'nothing')),
    helpers,
    toggleHelper: (h: Helper) =>
      setHelpers(toggleExclusive(helpers, h, 'notNeeded')),
    note,
    setNote,
    canSave: !saving && mood !== null && craving !== null,
    save,
  };
}
