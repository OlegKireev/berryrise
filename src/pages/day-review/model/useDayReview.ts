import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import {
  canReview,
  getDayReview,
  reviewDay,
  saveDayReview,
} from '@/entities/day-review';
import { getHabit } from '@/entities/habit';
import { syncNotifications } from '@/features/notifications';
import {
  type Craving,
  type Hardship,
  type Helper,
  type Mood,
} from '@/shared/config';
import { addDays, toDay, toggle } from '@/shared/lib';

// сколько держим награду перед закрытием
const DONE_MS = 300;

// Форма итогов дня. null - еще грузим
export function useDayReview() {
  const db = useSQLiteContext();

  // День из уведомления или карточки дня, иначе по текущему времени. Считаем один раз при открытии:
  // сохраняем ровно за тот, что в заголовке
  const params = useLocalSearchParams<{ day?: string }>();
  const [{ day, when, tooEarly }] = useState(() => {
    const now = Date.now();
    const day = params.day ?? reviewDay(now);
    const today = toDay(now);
    // из карточки дня может прийти и более старый день
    const when =
      day === today
        ? ('today' as const)
        : day === addDays(today, -1)
          ? ('yesterday' as const)
          : null;
    return { day, when, tooEarly: !canReview(day, now) };
  });
  // later - формы нет, только подсказка про 18:00: день раньше старта или сегодня до 18:00
  const [state, setState] = useState<{ later: boolean } | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [craving, setCraving] = useState<Craving | null>(null);
  const [hardships, setHardships] = useState<Hardship[]>([]);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const [habit, existing] = await Promise.all([
        getHabit(db),
        getDayReview(db, day),
      ]);

      if (existing) {
        setMood(existing.mood);
        setCraving(existing.craving);
        setHardships(existing.hardships);
        setHelpers(existing.helpers);
        setNote(existing.note ?? '');
      }

      setState({
        later: tooEarly || !habit || day < toDay(habit.startAt),
      });
    })();
  }, [db, day, tooEarly]);

  if (!state) {
    return null;
  }

  const save = async () => {
    if (mood === null || craving === null) {
      return;
    }

    setSaving(true);
    await saveDayReview(db, {
      date: day,
      mood,
      craving,
      hardships,
      // помощь спрашиваем только при тяге: скрытый выбор не сохраняем
      helpers: craving === 'none' ? [] : helpers,
      note,
    });
    syncNotifications(db);
    setDone(true);
    setTimeout(() => router.back(), DONE_MS);
  };

  return {
    ...state,
    day,
    when,
    mood,
    setMood,
    craving,
    setCraving,
    hardships,
    toggleHardship: (h: Hardship) => setHardships(toggle(hardships, h)),
    showHelpers: craving !== null && craving !== 'none',
    helpers,
    toggleHelper: (h: Helper) => setHelpers(toggle(helpers, h)),
    note,
    setNote,
    done,
    canSave: !saving && mood !== null && craving !== null,
    save,
  };
}
