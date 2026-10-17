import type { SQLiteDatabase } from 'expo-sqlite';

import { getSetting, setSetting } from '@/shared/db';
import { isRecord, parseJson } from '@/shared/lib';

import { defaultPrefs, type NotificationPrefs } from '../model/types';

const KEY = 'notifications';

const record = (v: unknown) => (isRecord(v) ? v : {});
const bool = (v: unknown, fallback: boolean) =>
  typeof v === 'boolean' ? v : fallback;
const num = (v: unknown, fallback: number) =>
  typeof v === 'number' ? v : fallback;

// Поле за полем поверх значений по умолчанию: вид, добавленный позже,
// у старых данных просто выключен, битое поле не ломает остальные
function parsePrefs(json: string | null): NotificationPrefs {
  const p = record(parseJson(json));
  const dayReview = record(p.dayReview);
  const risk = record(p.risk);
  const party = record(p.party);
  return {
    dayReview: {
      on: bool(dayReview.on, defaultPrefs.dayReview.on),
      time: num(dayReview.time, defaultPrefs.dayReview.time),
    },
    risk: {
      on: bool(risk.on, defaultPrefs.risk.on),
      days: isRecord(risk.days)
        ? Object.fromEntries(
            Object.entries(risk.days).filter(
              (e): e is [string, number] => typeof e[1] === 'number',
            ),
          )
        : defaultPrefs.risk.days,
    },
    party: { on: bool(party.on, defaultPrefs.party.on) },
  };
}

// Нет строки - ничего не включали
export const getPrefs = async (
  db: SQLiteDatabase,
): Promise<NotificationPrefs> => parsePrefs(await getSetting(db, KEY));

export const savePrefs = (db: SQLiteDatabase, prefs: NotificationPrefs) =>
  setSetting(db, KEY, prefs);
