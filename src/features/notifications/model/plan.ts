// Чистая логика расписания, без React Native.

import { reviewDay } from '@/entities/day-review';
import { isOneOf, isRecord, isString, toDay } from '@/shared/lib';

import type { NotificationKind, NotificationPrefs } from './types';

export const HORIZON_DAYS = 14;

// Что лежит в data уведомления: по нему потом понимаем, не устарело ли оно
export type NotificationData = {
  kind: NotificationKind;
  // день итогов (dayReview) или день риска (risk), YYYY-MM-DD
  day?: string;
  partyId?: string;
};

const kinds: readonly NotificationKind[] = ['dayReview', 'risk', 'party'];

// data из шторки или ответа на уведомление: могла остаться от старой версии, проверяем форму
export function parseNotificationData(data: unknown): NotificationData | null {
  if (!isRecord(data) || !isOneOf(kinds)(data.kind)) {
    return null;
  }

  return {
    kind: data.kind,
    day: isString(data.day) ? data.day : undefined,
    partyId: isString(data.partyId) ? data.partyId : undefined,
  };
}

export type Planned = NotificationData & { at: number };

type Data = {
  // даты сохраненных итогов дня, YYYY-MM-DD
  reviewDates: string[];
  // дни начала неудаленных вечеринок, YYYY-MM-DD
  partyDays: string[];
  activeParty: { id: string; expectedEndAt: number } | null;
};

// Разовые уведомления на HORIZON_DAYS дней вперед. Момент собираем из локальных
// полей даты, чтобы переход на летнее время не сдвигал время
export function plan(
  prefs: NotificationPrefs,
  now: number,
  { reviewDates, partyDays, activeParty }: Data,
): Planned[] {
  const reviews = new Set(reviewDates);
  const parties = new Set(partyDays);
  const today = new Date(now);
  const out: Planned[] = [];

  const at = (i: number, minutes: number) =>
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + i,
      Math.floor(minutes / 60),
      minutes % 60,
    ).getTime();

  for (let i = 0; i < HORIZON_DAYS; i++) {
    if (prefs.dayReview.on) {
      const t = at(i, prefs.dayReview.time);
      // по reviewDay: "Заполнить" открывает ровно тот день, о котором напомнили
      const day = reviewDay(t);

      if (t > now && !reviews.has(day)) {
        out.push({ kind: 'dayReview', at: t, day });
      }
    }

    if (prefs.risk.on) {
      const day = new Date(at(i, 0));
      const time = prefs.risk.days[day.getDay()];

      if (time !== undefined) {
        const t = at(i, time);

        if (t > now && !parties.has(toDay(t))) {
          out.push({ kind: 'risk', at: t, day: toDay(t) });
        }
      }
    }
  }

  if (prefs.party.on && activeParty && activeParty.expectedEndAt > now) {
    out.push({
      kind: 'party',
      at: activeParty.expectedEndAt,
      partyId: activeParty.id,
    });
  }

  return out;
}

// Уведомление в шторке больше не нужно: итоги за его день заполнены, в его день
// риска уже начата вечеринка, на его вечеринку ответили или ее отменили
export function isStale(
  { kind, day, partyId }: NotificationData,
  { reviewDates, partyDays, activeParty }: Data,
): boolean {
  if (kind === 'dayReview') {
    return !!day && reviewDates.includes(day);
  }

  if (kind === 'risk') {
    return !!day && partyDays.includes(day);
  }

  return activeParty?.id !== partyId;
}
