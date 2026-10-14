import * as Notifications from 'expo-notifications';
import type { SQLiteDatabase } from 'expo-sqlite';

import { listDayReviewDates } from '@/entities/day-review';
import { getActiveParty, listPartyStartsSince } from '@/entities/party';
import { toDay } from '@/shared/lib';

import { getPrefs } from '../api/prefs';
import { t } from '../i18n';
import { isStale, plan, type NotificationData } from './plan';
import { CHANNEL } from './setup';

const DAY = 24 * 60 * 60 * 1000;

async function run(db: SQLiteDatabase) {
  const now = Date.now();
  const [prefs, reviewDates, partyStarts, party] = await Promise.all([
    getPrefs(db),
    listDayReviewDates(db),
    listPartyStartsSince(db, now - DAY),
    getActiveParty(db),
  ]);
  const data = {
    reviewDates,
    partyDays: partyStarts.map(toDay),
    activeParty: party,
  };
  const planned = plan(prefs, now, data);

  // Из шторки убираем то, что уже сделано, даже если сделано не из уведомления
  const presented = await Notifications.getPresentedNotificationsAsync();
  await Promise.all(
    presented
      .filter((n) => {
        const d = n.request.content.data as Partial<NotificationData>;
        return d.kind && isStale(d as NotificationData, data);
      })
      .map((n) => Notifications.dismissNotificationAsync(n.request.identifier)),
  );

  await Notifications.cancelAllScheduledNotificationsAsync();
  await Promise.all(
    planned.map((p) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: t(`notify.${p.kind}.title`),
          body: t(`notify.${p.kind}.body`),
          data: { kind: p.kind, day: p.day, partyId: p.partyId },
          categoryIdentifier: p.kind,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: p.at,
          channelId: CHANNEL,
        },
      }),
    ),
  );
}

// Расписание целиком заново по текущим данным. Вызовы идут по очереди:
// параллельные cancel и schedule оставили бы дубли
let queue = Promise.resolve();

export const syncNotifications = (db: SQLiteDatabase) =>
  (queue = queue.then(() => run(db)).catch(console.warn));
