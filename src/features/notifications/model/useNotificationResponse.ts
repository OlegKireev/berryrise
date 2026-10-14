import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';

import { getActiveParty, setPartyResult } from '@/entities/party';

import type { NotificationData } from './plan';
import { syncNotifications } from './sync';

// Тапы и кнопки уведомлений. Последний ответ покрывает и холодный старт, и живое приложение
export function useNotificationResponse() {
  const db = useSQLiteContext();
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!response) return;
    const { actionIdentifier: action, notification } = response;
    const { kind, day, partyId } = notification.request.content
      .data as Partial<NotificationData>;
    const tap = action === Notifications.DEFAULT_ACTION_IDENTIFIER;

    (async () => {
      await Notifications.clearLastNotificationResponseAsync();
      // кнопки на Android уведомление не закрывают, в отличие от тапа
      await Notifications.dismissNotificationAsync(
        notification.request.identifier,
      );
      if (kind === 'dayReview') {
        // ровно тот день, о котором напомнили: в 18:30 reviewDay уже сегодняшний
        router.push(day ? `/day-review?day=${day}` : '/day-review');
      } else if (kind === 'risk') {
        router.push('/company');
      } else if (kind === 'party') {
        // старое уведомление после ответа на карточке ничего не меняет
        const active = !tap && (await getActiveParty(db))?.id === partyId;
        if (active && action === 'sober') {
          await setPartyResult(db, partyId!, 'sober');
          await syncNotifications(db);
        }
        router.navigate('/');
        if (active && action === 'drank')
          router.push(`/relapse?partyId=${partyId}`);
      }
    })();
  }, [db, response]);
}
